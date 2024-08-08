FROM node:lts-alpine AS base

FROM base AS builder
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune verifier-app --docker

FROM base AS installer
RUN apk update && apk add --no-cache python3 make g++
WORKDIR /app
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
COPY --from=builder /app/turbo.json ./turbo.json
COPY --from=builder /app/out/full/ .
RUN yarn install --frozen-lockfile
RUN yarn turbo run build --filter=verifier-app...

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=installer /app/apps/verifier-app/next.config.mjs .
COPY --from=installer /app/apps/verifier-app/package.json .

COPY --from=installer --chown=nextjs:nodejs /app/apps/verifier-app/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/verifier-app/.next/static ./apps/verifier-app/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/verifier-app/public ./apps/verifier-app/public

USER nextjs

EXPOSE 3000

CMD ["node", "apps/verifier-app/server.js"]
