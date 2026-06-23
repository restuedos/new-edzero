FROM node:22-bookworm-slim AS base
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl ca-certificates curl && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app
ENV CI=true

FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc tsconfig.base.json ./
COPY apps/site/package.json ./apps/site/
COPY packages/license-client/package.json ./packages/license-client/
RUN pnpm install --frozen-lockfile --filter @edzero/site...

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/site/node_modules ./apps/site/node_modules
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json .npmrc ./
COPY packages/license-client ./packages/license-client/
COPY apps/site ./apps/site/
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS=--no-deprecation
ARG NEXT_PUBLIC_SERVER_URL=https://edzero.test
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL
RUN pnpm --filter @edzero/license-client build && pnpm --filter @edzero/site build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/apps/site/public ./apps/site/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/site/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/site/.next/static ./apps/site/.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
CMD ["node", "apps/site/server.js"]
