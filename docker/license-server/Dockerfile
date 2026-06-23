FROM node:22-bookworm-slim AS base
RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl ca-certificates curl \
  && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app
ENV CI=true

FROM base AS builder
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json ./
COPY apps/license-server/package.json ./apps/license-server/
COPY apps/license-server/prisma ./apps/license-server/prisma/
COPY apps/license-server/tsconfig.json apps/license-server/nest-cli.json ./apps/license-server/
COPY apps/license-server/src ./apps/license-server/src/
RUN pnpm install --frozen-lockfile --filter @edzero/license-server...
WORKDIR /app/apps/license-server
RUN pnpm prisma generate && pnpm build
WORKDIR /app
RUN pnpm deploy --filter=@edzero/license-server --prod /prod/license-server
WORKDIR /prod/license-server
RUN npx prisma generate --schema=./prisma/schema.prisma

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /prod/license-server/ ./
COPY docker/license-server/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
EXPOSE 3001
HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
  CMD curl -fsS http://localhost:3001/api/health || exit 1
ENTRYPOINT ["/docker-entrypoint.sh"]
