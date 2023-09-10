FROM mcr.microsoft.com/playwright:v1.37.1-jammy

ENV PATH "$PATH:/root/.foundry/bin"

RUN apt-get update && apt-get install -y xvfb \
  && npm install -g pnpm@8.7.4

WORKDIR /e2e

COPY pnpm-lock.yaml package.json ./

RUN pnpm install --frozen-lockfile

COPY . .

ENV NODE_ENV=production

CMD ["xvfb-run", ":0", "-screen", "0", "1024x768x24", "-e", "/dev/stdout", "-listen", "tcp", "-ac", "--", "pnpm", "e2e:ci"]

