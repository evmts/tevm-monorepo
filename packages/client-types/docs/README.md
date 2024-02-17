@tevm/client-types / [Exports](modules.md)

<p align="center">
  <a href="https://tevm.sh/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/35039927/218812217-92f0f784-cb85-43b9-9ca6-e2b9effd9eb2.png">
      <img alt="wagmi logo" src="https://user-images.githubusercontent.com/35039927/218812217-92f0f784-cb85-43b9-9ca6-e2b9effd9eb2.png" width="auto" height="300">
    </picture>
  </a>
</p>

<p align="center">
  Execute solidity scripts in browser
<p>

[![CI](https://github.com/evmts/tevm-monorepo/actions/workflows/e2e.yml/badge.svg)](https://github.com/evmts/tevm-monorepo/actions/workflows/e2e.yml)
[![CI](https://github.com/evmts/tevm-monorepo/actions/workflows/unit.yml/badge.svg)](https://github.com/evmts/tevm-monorepo/actions/workflows/unit.yml)
<a href="https://www.npmjs.com/package/@tevm/api" target="\_parent">
<img alt="" src="https://img.shields.io/npm/dm/@tevm/api.svg" />
</a>
<a href="https://bundlephobia.com/package/@tevm/api@latest" target="\_parent">
<img alt="" src="https://badgen.net/bundlephobia/minzip/@tevm/api" />
</a>

# @tevm/spec

`@tevm/spec` is the official tevm spec represented as a typescript object [Tevm](./src/Tevm.ts). This spec is implemented by all tevm clients
including the

## [Tevm.ts](./src/Tevm.ts)

`Tevm` is the API type of Tevm implemented by

- `@tevm/vm` package the evm implementation of tevm
- `@tevm/client` package the remote JSON-RPC client for talking to a remote Tevm EVM

## High level API

Tevm core api follows an input/output pattern and is implemented in two ways:

- The ergonomic high level `action` based API
- The lower level JSON-RPC based API used for remote calls

This API is implemented with the following packages

#### Tevm high-level action based API

The high-level action based API is what most users and internal code are using whenever possible. It's more ergonomic, types are generic, and it is able to return more than 1 error.

- [@tevm/api/params](./src/params) - Inputs for tevm handlers
- [@tevm/api/result](./src/result) - Outputs for tevm handlers
- [@tevm/api/handlers](./src/handlers) - Generic handler types for processing params into results

#### Tevm low-level JSON-rpc based API

The lower level JSON-RPC api is more suitable for sending tevm requests remotely and mirrors the high level api.  Though sometimes a single JSON-RPC method will be overloaded with multiple higher level API actions.

- [@tevm/api/params](./src/params) - Inputs for tevm handlers
- [@tevm/api/result](./src/result) - Outputs for tevm handlers
- [@tevm/api/handlers](./src/handlers) - Generic handler types for processing params into results

## Visit [Docs](https://tevm.sh/) for docs, guides, API and more!

## See [Tevm Beta project board](https://github.com/orgs/tevm/projects/1) for progress on the upcoming beta release

## License 📄

<a href="./LICENSE"><img src="https://user-images.githubusercontent.com/35039927/231030761-66f5ce58-a4e9-4695-b1fe-255b1bceac92.png" width="200" /></a>
