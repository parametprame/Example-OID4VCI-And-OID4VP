FROM node:lts-slim AS base

FROM base AS builder
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune backend --docker

FROM base AS installer
RUN apt-get update && apt-get install -y python3 make g++
WORKDIR /app
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
COPY --from=builder /app/turbo.json ./turbo.json
COPY --from=builder /app/out/full/ .
RUN yarn install --frozen-lockfile
RUN yarn turbo run build --filter=backend...

FROM base AS runner
WORKDIR /app
RUN apt-get update && apt-get install -y libstdc++6 libc6 openssl

# TODO not run with root user
# RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 --ingroup nodejs nestjs
# COPY --from=installer --chown=nestjs:nodejs /app/ .

# USER nestjs

EXPOSE 4000

CMD ["node", "apps/backend/dist/src/main.js"]
