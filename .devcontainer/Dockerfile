# See https://containers.dev/
ARG VARIANT="bullseye"
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:18-${VARIANT}

# https://code.visualstudio.com/remote/advancedcontainers/reduce-docker-warnings
ENV APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE=DontWarn
ENV PATH="$PATH:/root/.foundry/bin"

# Install additional OS packages
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive && \
  apt-get --yes upgrade && \
  apt-get --yes install --no-install-recommends \
  curl sudo bash coreutils build-essential pkg-config libssl-dev clang

# install foundry - https://getfoundry.sh/
RUN curl --location https://foundry.paradigm.xyz | bash && \
  foundryup && \
  forge --version && \
  cast --version && \
  anvil --version

# Workaround for parallel building with forge with nx
# https://github.com/foundry-rs/foundry/issues/4736
RUN forge build

SHELL ["/bin/bash", "-c"]

# Install dependencies
RUN npm install --global pnpm@8.6.0 && \
  SHELL=bash pnpm setup && \
  source /root/.bashrc && \
  pnpm config set store-dir /root/.local/share/pnpm/store && \
  pnpm add --global nx

