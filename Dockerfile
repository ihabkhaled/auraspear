# ── Base stage ─────────────────────────────────────────────
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

# ── Dependencies stage ─────────────────────────────────────
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ── Builder stage ──────────────────────────────────────────
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build args for env vars needed at build time
ARG NEXT_PUBLIC_API_URL=/api
ARG NEXT_PUBLIC_APP_NAME="AuraSpear SOC"
ARG NEXT_PUBLIC_APP_ENV=production
ARG NEXT_PUBLIC_ENABLE_MSW=false

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME
ENV NEXT_PUBLIC_APP_ENV=$NEXT_PUBLIC_APP_ENV
ENV NEXT_PUBLIC_ENABLE_MSW=$NEXT_PUBLIC_ENABLE_MSW

RUN pnpm build

# ── Production stage ───────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
