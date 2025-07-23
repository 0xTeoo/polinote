FROM node:22-alpine AS base

WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Install system dependencies for media tools
RUN apk add --no-cache \
    ffmpeg \
    yt-dlp \
    && rm -rf /var/cache/apk/*

RUN corepack enable && corepack prepare pnpm@10.10.0 --activate

FROM base AS builder

COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm --filter entities build
RUN pnpm --filter video-worker build

FROM base AS runner

ENV TZ=UTC
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 worker
RUN chown worker:nodejs .
USER worker

COPY --from=builder --chown=worker:nodejs /app/package*.json .
COPY --from=builder --chown=worker:nodejs /app/pnpm-*.yaml ./

COPY --from=builder --chown=worker:nodejs /app/packages/entities/package*.json ./packages/entities/
COPY --from=builder --chown=worker:nodejs /app/packages/entities/dist ./packages/entities/dist

COPY --from=builder --chown=worker:nodejs /app/workers/video-worker/package*.json ./workers/video-worker/
COPY --from=builder --chown=worker:nodejs /app/workers/video-worker/dist ./workers/video-worker/dist

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm --filter entities install --frozen-lockfile
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm --filter video-worker install --frozen-lockfile

WORKDIR /app/workers/video-worker

ENTRYPOINT [ "pnpm", "--filter", "video-worker", "start" ] 