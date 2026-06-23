# EDZero 2.0

Company profile starter with **Payload CMS**, **Next.js**, and an integrated **license stack**. Default UI is a dark portfolio single-page site (EDZero Portfolio) editable via CMS, expandable to multi-page routes.

## Stack

| Layer | Technology |
|-------|------------|
| Public site + CMS admin | Next.js 16, Payload CMS 3, PostgreSQL |
| License vendor | NestJS license-server + Refine license-web |
| License client | `@edzero/license-client` (NestJS + Next.js `/core`) |
| Infra | Docker Compose, nginx TLS, MinIO, Mailpit, Redis |

## Repository layout

```
edzero 2.0/
├── apps/
│   ├── site/              # Next.js + Payload (public site + /admin CMS)
│   ├── license-server/    # License verification API
│   └── license-web/       # License vendor admin
├── packages/
│   └── license-client/
├── docker/
│   ├── site/Dockerfile
│   └── nginx/nginx.local.conf
├── guides/
│   ├── Personal Portfolio/   # Design reference mockups
│   └── CMS.md                  # Editor guide
└── scripts/dockhelp.sh
```

## Quick start (local)

### Prerequisites

- Node.js 22+, pnpm 9+
- Docker & Docker Compose
- `/etc/hosts` entries (see below)
- mkcert for trusted HTTPS (optional)

### Hosts file

```text
127.0.0.1 edzero.test www.edzero.test license.edzero.test minio.edzero.test s3.edzero.test pgadmin.edzero.test mailpit.edzero.test redis.edzero.test meilisearch.edzero.test rabbitmq.edzero.test
```

### With Docker (recommended)

```bash
cp .env.local.example .env.local
./scripts/generate-keys.sh
./docker/nginx/certs/generate-dev-tls.sh
./scripts/dockhelp.sh init --local
```

### Without Docker

```bash
cp .env.local.example .env.local
pnpm install
./scripts/generate-keys.sh

# Create PostgreSQL database `site` and user, then:
pnpm --filter @edzero/site seed

pnpm dev:site          # https://edzero.test equivalent: http://localhost:3000
pnpm dev:license-server
pnpm dev:license-web
```

## URLs (local)

| Service | URL |
|---------|-----|
| Company profile (single-page) | `https://edzero.test` |
| About / Services / Portfolio / Blog / Contact | `/about`, `/services`, `/portfolio`, `/blog`, `/contact` |
| Payload CMS admin | `https://edzero.test/admin` |
| License activation | `https://edzero.test/license/activate` |
| License vendor admin | `https://license.edzero.test` |
| License API docs | `https://license.edzero.test/api/docs` |

## License enforcement

The starter requires a valid license before the public site and CMS admin are usable.

1. Generate RSA keys: `./scripts/generate-keys.sh`
2. Set `LICENSE_VERIFY_URL` in `.env.local` (empty = enforcement off for local dev)
3. Activate at `https://edzero.test/license/activate`

## CMS default login

After seed: `admin@edzero.test` / `password`

See [guides/CMS.md](guides/CMS.md) for content types and editing workflow.

## Docker Compose profiles

`COMPOSE_PROFILES=license,search,queue,tools`

| Profile | Services |
|---------|----------|
| default | site, nginx, pgsql, redis, mailpit, minio |
| `license` | license-server, license-pgsql, license-web |
| `search` | Meilisearch |
| `queue` | RabbitMQ |
| `tools` | pgAdmin, RedisInsight |

## Scripts

```bash
pnpm dev:site           # Next.js + Payload dev server
pnpm dev:all            # site + license stack
pnpm --filter @edzero/site seed
pnpm build
./scripts/dockhelp.sh help
```

## License

MIT
