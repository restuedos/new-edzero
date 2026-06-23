FROM node:22-bookworm-slim AS builder
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app
ENV CI=true
ARG VITE_LICENSE_API_URL=https://license.edzero.test/api
ENV VITE_LICENSE_API_URL=$VITE_LICENSE_API_URL
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/license-web/package.json ./apps/license-web/
COPY apps/license-web/index.html apps/license-web/vite.config.ts apps/license-web/tsconfig.json ./apps/license-web/
COPY apps/license-web/src ./apps/license-web/src/
RUN pnpm install --frozen-lockfile --filter @edzero/license-web...
RUN pnpm --filter @edzero/license-web build

FROM nginx:alpine
COPY docker/nginx/spa.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/license-web/dist /usr/share/nginx/html
EXPOSE 80
