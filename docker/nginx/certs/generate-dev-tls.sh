#!/usr/bin/env bash
# Local TLS for edzero.test / *.edzero.test. Do not commit cert or key (see root .gitignore).
set -euo pipefail
cd "$(dirname "$0")"
CERT="edzero.test.pem"
KEY="edzero.test-key.pem"

if command -v mkcert >/dev/null 2>&1; then
  mkcert -cert-file "$CERT" -key-file "$KEY" edzero.test "*.edzero.test" 127.0.0.1 ::1
  chmod 600 "$KEY"
  echo "Wrote $CERT and $KEY via mkcert (run \`mkcert -install\` once if browsers still warn)."
else
  echo "mkcert not found; using openssl self-signed (browsers may warn)."
  openssl req -x509 -newkey rsa:2048 \
    -keyout "$KEY" \
    -out "$CERT" \
    -days 825 -nodes \
    -subj "/O=EDZero Dev/CN=edzero.test" \
    -addext "subjectAltName=DNS:edzero.test,DNS:*.edzero.test,DNS:www.edzero.test,IP:127.0.0.1,IP:::1"
  chmod 600 "$KEY"
  echo "Wrote $CERT and $KEY"
fi
