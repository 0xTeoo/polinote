FROM node:22-alpine AS base

WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack prepare pnpm@10.10.0 --activate

FROM base AS builder

COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm --filter entities build
RUN pnpm --filter api build

FROM base AS runner

EXPOSE 4000

ENV TZ=UTC
ENV PORT=4000
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
RUN chown nestjs:nodejs .
USER nestjs

COPY --from=builder --chown=nestjs:nodejs /app/package*.json .
COPY --from=builder --chown=nestjs:nodejs /app/pnpm-*.yaml ./

COPY --from=builder --chown=nestjs:nodejs /app/packages/entities/package*.json ./packages/entities/
COPY --from=builder --chown=nestjs:nodejs /app/packages/entities/dist ./packages/entities/dist

COPY --from=builder --chown=nestjs:nodejs /app/apps/api/package*.json ./apps/api/
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./apps/api/dist

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm --filter entities install --frozen-lockfile
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm --filter api install --frozen-lockfile

ENTRYPOINT [ "pnpm", "--filter", "api", "start:prod" ]
