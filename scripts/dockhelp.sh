#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="${ROOT}/docker-compose.local.yml"
ENV_FILE="${ROOT}/.env.local"

cmd="${1:-help}"
shift || true

compose() {
  docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" "$@"
}

wait_for_db() {
  local tries=0
  until compose exec -T pgsql pg_isready -U "${DB_USERNAME:-edzero}" -d "${DB_DATABASE:-edzero}" >/dev/null 2>&1; do
    tries=$((tries + 1))
    if [[ $tries -ge 30 ]]; then
      echo "Timed out waiting for pgsql" >&2
      exit 1
    fi
    sleep 2
  done
}

wait_for_license_db() {
  local tries=0
  until compose exec -T license-pgsql pg_isready -U "${LICENSE_DB_USERNAME:-license}" -d "${LICENSE_DB_DATABASE:-license}" >/dev/null 2>&1; do
    tries=$((tries + 1))
    if [[ $tries -ge 30 ]]; then
      echo "Timed out waiting for license-pgsql" >&2
      exit 1
    fi
    sleep 2
  done
}

migrate_license_db() {
  echo "Migrating license database..."
  compose exec -T license-server npx prisma migrate deploy
  echo "Seeding license admin..."
  compose exec -T license-server npx prisma db seed
}

ensure_site_db() {
  compose exec -T pgsql psql -U "${DB_USERNAME:-edzero}" -d postgres -v ON_ERROR_STOP=1 <<SQL || true
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${SITE_DB_USERNAME:-site}') THEN
    CREATE USER ${SITE_DB_USERNAME:-site} WITH PASSWORD '${SITE_DB_PASSWORD:-secret}';
  END IF;
END
\$\$;
SELECT 'CREATE DATABASE ${SITE_DB_DATABASE:-site} OWNER ${SITE_DB_USERNAME:-site}'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${SITE_DB_DATABASE:-site}')\\gexec
ALTER DATABASE ${SITE_DB_DATABASE:-site} OWNER TO ${SITE_DB_USERNAME:-site};
GRANT ALL PRIVILEGES ON DATABASE ${SITE_DB_DATABASE:-site} TO ${SITE_DB_USERNAME:-site};
SQL

  compose exec -T pgsql psql -U "${DB_USERNAME:-edzero}" -d "${SITE_DB_DATABASE:-site}" -v ON_ERROR_STOP=1 <<SQL || true
GRANT ALL ON SCHEMA public TO ${SITE_DB_USERNAME:-site};
ALTER SCHEMA public OWNER TO ${SITE_DB_USERNAME:-site};
SQL
}

load_env() {
  # shellcheck disable=SC1091
  set -a && source "$ENV_FILE" && set +a
}

seed_site() {
  load_env
  export PAYLOAD_DB_PUSH=true
  cd "${ROOT}" && pnpm --filter @edzero/site seed
}

case "$cmd" in
  help)
    cat <<'EOF'
dockhelp — EDZero 2.0 Docker helper

  dockhelp init [--local]   Start stack, migrate Payload, seed CMS
  dockhelp compose [args]   Docker compose (local)
  dockhelp shell            Shell into site container
  dockhelp seed             Seed Payload CMS content
  dockhelp test             Run tests
  dockhelp pnpm [args]      Run pnpm on host
EOF
    ;;
  init)
    # shellcheck disable=SC1091
    set -a && source "$ENV_FILE" && set +a

    cert_dir="${ROOT}/docker/nginx/certs"
    if [[ ! -f "${cert_dir}/edzero.test.pem" || ! -f "${cert_dir}/edzero.test-key.pem" ]]; then
      echo "Generating local TLS certificates..."
      chmod +x "${cert_dir}/generate-dev-tls.sh"
      (cd "${cert_dir}" && ./generate-dev-tls.sh)
    fi

    if [[ ! -f "${ROOT}/storage/private/license-encryption-public.rsa" ]]; then
      echo "Generating license RSA keys..."
      "${ROOT}/scripts/generate-keys.sh"
    fi

    echo "Starting infrastructure..."
    compose up -d --build --remove-orphans pgsql license-pgsql redis mailpit minio meilisearch rabbitmq pgadmin redisinsight

    echo "Waiting for databases..."
    wait_for_db
    ensure_site_db

    echo "Starting site..."
    compose up -d --build --remove-orphans site

    echo "Waiting for site..."
    sleep 8

    echo "Seeding Payload CMS..."
    seed_site || true

    echo "Starting nginx + license stack..."
    compose up -d --build --remove-orphans license-server license-web
    wait_for_license_db
    migrate_license_db
    compose up -d nginx

    echo "Init complete."
    echo "Site:     https://edzero.test"
    echo "CMS:      https://edzero.test/admin  (admin@edzero.test / password)"
    echo "License:  https://license.edzero.test  (admin@license.edzero.test / password)"
    compose ps
    ;;
  compose)
    compose "$@"
    ;;
  shell)
    compose exec site sh
    ;;
  seed)
    seed_site
    ;;
  test)
    cd "$ROOT" && pnpm test
    ;;
  npm|pnpm)
    cd "$ROOT" && pnpm "$@"
    ;;
  *)
    echo "Unknown command: $cmd" >&2
    exit 1
    ;;
esac
