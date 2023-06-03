ARG VARIANT="bullseye"
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${VARIANT}

# https://code.visualstudio.com/remote/advancedcontainers/reduce-docker-warnings
ENV APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE=DontWarn

# Install additional OS packages
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive && \
  apt-get --yes upgrade && \
  apt-get --yes install curl sudo bash coreutils git
  # && \
  #
  # install foundry - https://getfoundry.sh/
  # curl -L https://foundry.paradigm.xyz | bash && \
  # #
  # # Run it
  # foundryup && \
  # foundryup --version

# [Choice] Node.js version: none, lts/*, 16, 14, 12, 10
ARG NODE_VERSION="lts/*"
RUN if [ "${NODE_VERSION}" != "none" ]; then umask 0002 \
  && sh -c ". /usr/local/share/nvm/nvm.sh && nvm install ${NODE_VERSION}" 2>&1; fi

RUN sh -c ". /usr/local/share/nvm/nvm.sh && nvm alias default ${NODE_VERSION}"

SHELL ["/bin/bash", "-c"]

# Install dependencies
RUN npm install --global pnpm@latest && \
  SHELL=bash pnpm setup && \
  source /root/.bashrc && \
  pnpm config set store-dir /root/.local/share/pnpm/store && \
  pnpm add --global bun nx

