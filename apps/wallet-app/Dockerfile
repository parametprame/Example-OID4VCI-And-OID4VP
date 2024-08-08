FROM node:lts-alpine AS base

FROM base AS builder
RUN apk update && apk add --no-cache python3 make g++
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune wallet-app --docker

FROM base AS installer
RUN apk update && apk add --no-cache python3 make g++
WORKDIR /app
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
COPY --from=builder /app/turbo.json ./turbo.json
COPY --from=builder /app/out/full/ .
RUN yarn install --frozen-lockfile

ARG NEXTAUTH_URL
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ARG NEXTAUTH_SECRET
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ARG NEXT_PUBLIC_HOLDER_URL
ENV NEXT_PUBLIC_HOLDER_URL=$NEXT_PUBLIC_HOLDER_URL

RUN yarn turbo run build --filter=wallet-app...

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=installer /app/apps/wallet-app/next.config.mjs .
COPY --from=installer /app/apps/wallet-app/package.json .

COPY --from=installer --chown=nextjs:nodejs /app/apps/wallet-app/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/wallet-app/.next/static ./apps/wallet-app/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/wallet-app/public ./apps/wallet-app/public

USER nextjs

EXPOSE 3000

CMD ["node", "apps/wallet-app/server.js"]
