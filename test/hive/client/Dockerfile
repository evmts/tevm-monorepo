FROM node:24-alpine

WORKDIR /app
COPY . /app

RUN corepack enable && corepack prepare pnpm@10.6.1 --activate && pnpm install --frozen-lockfile

EXPOSE 8545
ENTRYPOINT ["/app/test/hive/client/entrypoint.sh"]
