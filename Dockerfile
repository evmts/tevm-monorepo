# syntax=docker/dockerfile:1
FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN apt-get update && apt-get install -y \
    curl \
    wget \
    git \
    build-essential \
    pkg-config \
    libssl-dev \
    ca-certificates \
    xz-utils \
    python3 \
    unzip \
    && rm -rf /var/lib/apt/lists/*

RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:$PATH"

RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:$PATH"

RUN wget https://ziglang.org/download/0.11.0/zig-linux-x86_64-0.11.0.tar.xz && \
    tar -xf zig-linux-x86_64-0.11.0.tar.xz && \
    mv zig-linux-x86_64-0.11.0 /usr/local/zig && \
    ln -s /usr/local/zig/zig /usr/local/bin/zig && \
    rm zig-linux-x86_64-0.11.0.tar.xz

WORKDIR /app

FROM base AS deps
COPY pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm fetch

FROM deps AS prod-deps
COPY package.json pnpm-workspace.yaml nx.json ./

COPY . /tmp/tevm-src/
RUN cd /tmp/tevm-src && \
    find . -name "package.json" -not -path "./node_modules/*" -not -path "./.git/*" -not -path "./dist/*" | \
    while read -r file; do \
        mkdir -p "/app/$(dirname "$file")" && \
        cp "$file" "/app/$file"; \
    done && \
    rm -rf /tmp/tevm-src

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --offline

FROM prod-deps AS dev
COPY . .

ENV TEVM_RPC_URLS_MAINNET=""
ENV TEVM_RPC_URLS_OPTIMISM=""

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm run build:dist --parallel=2 || true && \
    pnpm run build:types --parallel=2 || true

CMD ["bun", "allz"]
