# This is a mutli-stage Docker build.
# Stage 0 (named `manifests`) collects the dependency manifest files
# Stage 1 (named `monorepo`) builds the monorepo
# Stage 2 (named: 'frontend') builds the frontend for deployment
# Stage 3 (named: 'backend') builds the backend for deployment
# Stage 4 (named: 'e2e') builds playwright and metamask for e2e testing

# Multistage builds allow our final deployments to be small and to maximize
# cache hits. In future we will further optimize by using remote nx cache
# to share cache hits between builds.

# ███╗░░░███╗░█████╗░███╗░░██╗██╗███████╗███████╗░██████╗████████╗░██████╗
# ████╗░████║██╔══██╗████╗░██║██║██╔════╝██╔════╝██╔════╝╚══██╔══╝██╔════╝
# ██╔████╔██║███████║██╔██╗██║██║█████╗░░█████╗░░╚█████╗░░░░██║░░░╚█████╗░
# ██║╚██╔╝██║██╔══██║██║╚████║██║██╔══╝░░██╔══╝░░░╚═══██╗░░░██║░░░░╚═══██╗
# ██║░╚═╝░██║██║░░██║██║░╚███║██║██║░░░░░███████╗██████╔╝░░░██║░░░██████╔╝
# ╚═╝░░░░░╚═╝╚═╝░░╚═╝╚═╝░░╚══╝╚═╝╚═╝░░░░░╚══════╝╚═════╝░░░░╚═╝░░░╚═════╝░

# Stage 0 (named `manifests`) collects
# dependency manifest files (`package.json` and `yarn.lock`) which are then
# used by stage 1 to install these dependencies
# development. The only reason we need a separate stage just for collecting the
# dependency manifests is that Docker's `COPY` command still does not allow
# copying based on a glob pattern (see this GitHub issue for more details
# https://github.com/moby/moby/issues/15858). Being able to copy only manifests
# into stage 1 (the `COPY --from=manifests` statement) is important to maximize
# Docker build cache hit rate. `alpine` is chosen as the base image for the
# first stage because it's the smallest image that have access to the `cp
# --parents -t` command (by installing the `coreutils` package).
FROM alpine:3.16 as manifests
RUN apk add coreutils

WORKDIR /tmp
COPY tsconfig.json .gitmodules pnpm-workspace.yaml pnpm-lock.yaml .nvmrc package.json ./src/
COPY packages src/packages/
COPY apps src/apps/
RUN mkdir manifests && \
  cd src && \
  # copy package.json recursively
  find . -name 'package.json' | xargs cp --parents -t ../manifests/ && \
  # pnpm-lock
  cp pnpm-lock.yaml ../manifests/ && \
  # pnpm-workspace
  cp pnpm-workspace.yaml ../manifests/ && \
  # .nvmrc
  cp .nvmrc ../manifests/ && \
  # .gitmodules
  cp .gitmodules ../manifests/ && \
  # tsconfig
  cp tsconfig.json ../manifests/

# ███╗░░░███╗░█████╗░███╗░░██╗░█████╗░██████╗░███████╗██████╗░░█████╗░
# ████╗░████║██╔══██╗████╗░██║██╔══██╗██╔══██╗██╔════╝██╔══██╗██╔══██╗
# ██╔████╔██║██║░░██║██╔██╗██║██║░░██║██████╔╝█████╗░░██████╔╝██║░░██║
# ██║╚██╔╝██║██║░░██║██║╚████║██║░░██║██╔══██╗██╔══╝░░██╔═══╝░██║░░██║
# ██║░╚═╝░██║╚█████╔╝██║░╚███║╚█████╔╝██║░░██║███████╗██║░░░░░╚█████╔╝
# ╚═╝░░░░░╚═╝░╚════╝░╚═╝░░╚══╝░╚════╝░╚═╝░░╚═╝╚══════╝╚═╝░░░░░░╚════╝░

# stage 1 (named 'monorepo') installs all dependencies
# and builds all packages in the monorepo
# This stage is expensive and it's final image is very large
# for that reason we do not deploy anything from this stage
# but it is capable of running anything in the monorepo nonetheless
# including the integration tests, unit tests, lint, any application
# and dev servers, etc.   You can even develop completely in this image!
# We start with playwright image purely for convenience.  This image
# has all the dependencies we need to build the monorepo and run the
# integration tests.  We would ideally use a smaller image such as
# node-alpine with the exact same node version as our nvmrc file
# this node version doesn't exctly match our nvmrce file and we should
# fix that.  I tried to install with nvm but it was a pain and I gave up
# for now
FROM node:18.12.1-bullseye as monorepo

ENV PATH "$PATH:/root/.foundry/bin"
ENV NX_DAEMON=false

# Add the Foundry CLI to the PATH and do a quick test to make sure it's installed to path
RUN curl -L https://foundry.paradigm.xyz | bash && \
  foundryup && \
  forge --version && \
  anvil --version && \
  cast --version && \
  npm i pnpm@7.26.2 --global

WORKDIR /monorepo

# Copy manifest files into the image in
# preparation for `yarn install`.
COPY --from=manifests --chown=node:node /tmp/manifests  ./

# install all dependencies
RUN pnpm i --frozen-lockfile

# set NODE_ENV after installing so dev deps get installed
ENV NODE_ENV=production

# copy rest of repo and buildd
COPY . .

# build all apps and packages
RUN pnpm build && rm -rf node_modules/.cache

CMD ["pnpm", "nx", "run-many", "--targets=test,lint,typecheck", "--all", "--parallel"]

# ██╗░░░██╗██╗████████╗███████╗  ░█████╗░██████╗░██████╗░
# ██║░░░██║██║╚══██╔══╝██╔════╝  ██╔══██╗██╔══██╗██╔══██╗
# ╚██╗░██╔╝██║░░░██║░░░█████╗░░  ███████║██████╔╝██████╔╝
# ░╚████╔╝░██║░░░██║░░░██╔══╝░░  ██╔══██║██╔═══╝░██╔═══╝░
# ░░╚██╔╝░░██║░░░██║░░░███████╗  ██║░░██║██║░░░░░██║░░░░░
# ░░░╚═╝░░░╚═╝░░░╚═╝░░░╚══════╝  ╚═╝░░╚═╝╚═╝░░░░░╚═╝░░░░░
# @evmts/frontend
# Stage 2 (named frontend) is the stage that prepares the frontend for
# production. It uses the nginx image to serve the frontend.
# The nginx image is configured to serve the frontend from the
# /usr/share/nginx/html directory. The frontend is copied from the
# build directory of the frontend stage.
# The build for the frontend is a simple vite bundle.  Vite will bundle
# everything including javascript, images, sass, node_modules and more into
# a single directory.  This directory is then served by nginx.
# The nginx configuration is copied from the ops/nginx.conf file.
# The nginx image exposes port 80.
# The nginx image is started with the command "nginx -g daemon off;".
# This command starts nginx in the foreground.
# The nginx image is based on the alpine image.
# The alpine image is a lightweight image that is optimized for size.
# The alpine image is based on the musl libc library.
# we don't use alpine for most of our images because it's very difficult to
# get the right dependencies installed for the various packages we use.
# it only supports very specific node.js versions (well) for the most part
# and it's even more difficult to get playwright or puppeteer to work on it.
FROM nginx:stable-alpine as playground-runner
COPY --from=monorepo /monorepo/apps/docs/dist /usr/share/nginx/html
COPY apps/playground/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# ██████╗░░█████╗░░█████╗░░██████╗
# ██╔══██╗██╔══██╗██╔══██╗██╔════╝
# ██║░░██║██║░░██║██║░░╚═╝╚█████╗░
# ██║░░██║██║░░██║██║░░██╗░╚═══██╗
# ██████╔╝╚█████╔╝╚█████╔╝██████╔╝
# ╚═════╝░░╚════╝░░╚════╝░╚═════╝░
FROM nginx:stable-alpine as docs-runner
COPY --from=monorepo /monorepo/apps/playground/dist /usr/share/nginx/html
COPY apps/playground/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# ░█████╗░░█████╗░███╗░░██╗████████╗██████╗░░█████╗░░█████╗░████████╗░██████╗
# ██╔══██╗██╔══██╗████╗░██║╚══██╔══╝██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝██╔════╝
# ██║░░╚═╝██║░░██║██╔██╗██║░░░██║░░░██████╔╝███████║██║░░╚═╝░░░██║░░░╚█████╗░
# ██║░░██╗██║░░██║██║╚████║░░░██║░░░██╔══██╗██╔══██║██║░░██╗░░░██║░░░░╚═══██╗
# ╚█████╔╝╚█████╔╝██║░╚███║░░░██║░░░██║░░██║██║░░██║╚█████╔╝░░░██║░░░██████╔╝
# ░╚════╝░░╚════╝░╚═╝░░╚══╝░░░╚═╝░░░╚═╝░░╚═╝╚═╝░░╚═╝░╚════╝░░░░╚═╝░░░╚═════╝░

# Use the latest foundry image
# TODO pin this to a specific version
FROM ghcr.io/foundry-rs/foundry as contracts-deployer

WORKDIR /monorepo
COPY . .

# install without using git
RUN forge install && \
  forge build && \
  forge test && \
  rm -rf cache

ENTRYPOINT ["forge", "script", "packages/contracts/script/Deploy.s.sol:Deploy"]
CMD [ "--rpc-url", "http://anvil:8545" ]

# ███████╗██████╗░███████╗
# ██╔════╝╚════██╗██╔════╝
# █████╗░░░░███╔═╝█████╗░░
# ██╔══╝░░██╔══╝░░██╔══╝░░
# ███████╗███████╗███████╗
# ╚══════╝╚══════╝╚══════╝
# Stage 4 (named e2e) is the stage that prepares playwright for
# running the e2e tests.  It's a separate stage because playwright
# and docker don't play nice together.  To make sure we don't have
# issues maintaining it we always run the app in a seperate
# image from the playwright tests.   We keep the playwright
# image only for playwright and use the official microsoft
# playwright image as a base.  This makes it unlikely we will
# have issues and an easy upgrade path into the future.
# As a result these e2e tests run if the app is running seperately
# outside of this container.
# We use the builds form previous stage but otherwise
# mostly build this image from scratch to make sure no node module
# installations on different images are incompatible with each other.
# WARNING - the node version here is a different 16.x version than the
# nvmrc version.  This is unlikely to cause issues
FROM mcr.microsoft.com/playwright:v1.29.0-focal as e2e

ENV NX_DAEMON=false
ENV PATH "$PATH:/root/.foundry/bin"

RUN apt-get update && apt-get install -y \
  make \
  g++ --no-install-recommends && curl \
  # Add the Foundry CLI to the PATH and do a quick test to make sure it's installed to path
  curl -L https://foundry.paradigm.xyz | bash && \
  foundryup && forge --version && anvil --version && cast --version && \
  # Install pnpm to install node modules
  npm i pnpm@7.26.2 --global

WORKDIR /monorepo

# Copy manifest files into the image in
# preparation for `yarn install`.
COPY pnpm-workspace.yaml pnpm-lock.yaml .nvmrc package.json ./
COPY ./apps/e2e ./apps/e2e/

# ignore scripts dealing with presinstall and postinstall
RUN pnpm i --frozen-lockfile --ignore-scripts
ENV NODE_ENV=production

# TODO actually run the e2e tests
