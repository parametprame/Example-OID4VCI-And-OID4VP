# Multi-stage build 
FROM node:lts-alpine AS base

FROM base AS builder
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune issuer-app --docker

FROM base AS installer
RUN apk update && apk add --no-cache python3 make g++
WORKDIR /app
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
COPY --from=builder /app/turbo.json ./turbo.json
COPY --from=builder /app/out/full/ .
RUN yarn install --frozen-lockfile

ARG NEXT_PUBLIC_ISSUER_URL
ENV NEXT_PUBLIC_ISSUER_URL=$NEXT_PUBLIC_ISSUER_URL

RUN yarn turbo run build --filter=issuer-app...

FROM base AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=installer /app/apps/issuer-app/next.config.mjs .
COPY --from=installer /app/apps/issuer-app/package.json .
COPY --from=installer --chown=nextjs:nodejs /app/apps/issuer-app/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/issuer-app/.next/static ./apps/issuer-app/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/issuer-app/public ./apps/issuer-app/public

USER nextjs

EXPOSE 3000

CMD ["node", "apps/issuer-app/server.js"]
