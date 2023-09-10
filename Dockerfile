FROM node:18.12.1-bullseye as monorepo

ENV PATH "$PATH:/root/.foundry/bin"
ENV NX_DAEMON=false

# Add the Foundry CLI to the PATH and do a quick test to make sure it's installed to path
RUN curl -L https://foundry.paradigm.xyz | bash && \
  foundryup && \
  forge --version && \
  anvil --version && \
  cast --version && \
  npm install -g pnpm@8.7.4

WORKDIR /monorepo

# Copy manifest files into the image in
# preparation for `yarn install`.
COPY pnpm-workspace.yaml pnpm-lock.yaml .nvmrc ./

# install all dependencies
RUN pnpm fetch

# copy rest of repo and buildd
COPY . .

# build all apps and packages
RUN pnpm install --frozen-lockfile && pnpm nx run-many --target=build:dist

CMD ["pnpm", "all"]

# @evmts/example-next
# FROM nginx:stable-alpine as example-next
# COPY --from=monorepo /monorepo/examples/next/dist /usr/share/nginx/html
# COPY apps/ts-sol-playground/nginx.conf /etc/nginx/conf.d/default.conf
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

# @evmts/example-vite
FROM nginx:stable-alpine as example-vite
COPY --from=monorepo /monorepo/examples/vite/dist /usr/share/nginx/html
COPY examples/vite/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

