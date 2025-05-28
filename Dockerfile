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

# Install cbindgen for Zig builds
RUN cargo install cbindgen
# Ensure cargo bin is in PATH for all subsequent commands
ENV PATH="/root/.cargo/bin:$PATH"
# Create hard link instead of symlink to make cbindgen available system-wide
RUN cp /root/.cargo/bin/cbindgen /usr/local/bin/cbindgen && chmod +x /usr/local/bin/cbindgen
# Verify cbindgen is accessible
RUN which cbindgen && cbindgen --version
# Also verify the files exist where Zig expects them
RUN ls -la /usr/local/bin/cbindgen && ls -la /root/.cargo/bin/cbindgen
# Test that cbindgen works from different paths
RUN /usr/local/bin/cbindgen --version && /root/.cargo/bin/cbindgen --version

RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:$PATH"

# Install Zig with architecture detection
RUN ARCH=$(uname -m) && \
    if [ "$ARCH" = "x86_64" ]; then \
        ZIG_ARCH="x86_64"; \
    elif [ "$ARCH" = "aarch64" ]; then \
        ZIG_ARCH="aarch64"; \
    else \
        echo "Unsupported architecture: $ARCH" && exit 1; \
    fi && \
    wget https://ziglang.org/download/0.14.0/zig-linux-${ZIG_ARCH}-0.14.0.tar.xz && \
    tar -xf zig-linux-${ZIG_ARCH}-0.14.0.tar.xz && \
    mv zig-linux-${ZIG_ARCH}-0.14.0 /usr/local/zig && \
    ln -s /usr/local/zig/zig /usr/local/bin/zig && \
    rm zig-linux-${ZIG_ARCH}-0.14.0.tar.xz

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
ENV NX_DAEMON="false"
# Ensure all tools are in PATH
ENV PATH="/root/.cargo/bin:/root/.bun/bin:/usr/local/zig:$PATH"

# Debug cbindgen availability
RUN which cbindgen && cbindgen --version && ls -la /usr/local/bin/cbindgen || true
RUN echo "PATH=$PATH" && echo "Available in /root/.cargo/bin:" && ls -la /root/.cargo/bin/ || true

# Build TypeScript/JavaScript packages
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm run build:dist --parallel=2 || true
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm run build:types --parallel=2 || true

# Run tests as the default command
CMD ["pnpm", "run", "test:coverage"]
