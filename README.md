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
├── storage/               # Runtime data (license.json, uploads, CV)
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

Payload REST/GraphQL is served under `https://edzero.test/api/*` (same origin as the site). There is no separate `api.edzero.test` host in this setup.

## License enforcement

The starter requires a valid license before the public site and CMS admin are usable.

1. Generate RSA keys: `./scripts/generate-keys.sh`
2. Set `LICENSE_VERIFY_URL` in `.env.local` (empty = enforcement off for local dev)
3. Generate a key in the license vendor admin (`https://license.edzero.test`, default login after seed: `admin@license.edzero.test` / `password`)
4. Activate at `https://edzero.test/license/activate`

**Heartbeat (default on):** With `LICENSE_HEARTBEAT_ENABLED` unset or `true`, the site pings the license server periodically (via `/api/license/status`, throttled to at most once per hour). If the server reports revoke/suspend, the local license file is removed and the site redirects to activation. Stale window defaults to 24 hours (`LICENSE_HEARTBEAT_MAX_STALE_HOURS`).

Check status:

```bash
curl -s https://edzero.test/api/license/status | jq
```

## CMS

Admin: `https://edzero.test/admin` — after seed: `admin@edzero.test` / `password`

| Collection / global | Used on the site |
|---------------------|------------------|
| **Global Settings** | Hero, about, skillset, theme colors, contact info, social links, copyright |
| **Services** | `#services` and `/services` |
| **Projects** | `#portfolio` and `/portfolio` |
| **Partners** | Partner logo strip on homepage |
| **Testimonials** | `#testimonials` carousel |
| **Articles** | `#journal`, `/blog`, `/blog/[slug]` |
| **Contact Submissions** | Inbound contact form messages (admin only) |
| **Media** | Images and CV PDF — MinIO bucket `edzero`, served via `https://s3.edzero.test` |

Global Settings includes a **Theme colors** group (primary accent, backgrounds, surfaces, text) and a **Skillset** array for the About section. Changes apply on save without rebuilding the site.

**Live Preview:** In Global Settings or Articles, use the eye icon in the document toolbar to open a split-screen frontend preview that refreshes after Save.

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
pnpm install
pnpm test               # license-client + license-server tests
pnpm lint               # TypeScript check per app
pnpm build              # site + license stack
pnpm dev:site           # Next.js + Payload dev server
pnpm dev:all            # site + license stack
pnpm --filter @edzero/site seed
./scripts/dockhelp.sh help
```

## Verification (smoke test)

After `./scripts/dockhelp.sh init --local`:

1. **Build** — `pnpm build` exits 0
2. **License gate** — without `storage/private/license.json`, `https://edzero.test` redirects to `/license/activate`
3. **Activate** — generate key in license admin, activate on site, homepage loads
4. **CMS** — log in at `/admin`, edit Global Settings, confirm Live Preview updates
5. **Revoke** — revoke license in vendor admin; after heartbeat, site locks again

Rebuild a single service:

```bash
docker compose -f docker-compose.local.yml up -d --build site
```

## License

MIT
