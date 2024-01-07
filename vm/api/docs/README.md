@tevm/api / [Exports](modules.md)

<p align="center">
  <a href="https://tevm.dev/">
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

# @tevm/api

Tevm spec represented as typescript types

This package has no javascript only typescript types. For it's implementation see [@tevm/procedures](../handlers)

- [./src/actions] - Request Action types for interacting with tevm
- [./src/common] - Common types such as block types and log types
- [./src/errors] - Error types for tevm actions
- [./src/handlers] - Request/Response Interface for Tevm handlers. Sometimes generic
- [./src/responses] - Response types

## Actions

#### Account

Modifies the evm with an account or contract

#### Call

Low level call of the evm with very low level control

#### Contract

A typesafe higher level action similar to call but typed for using a contract. The bytecode is expected to already be deployed.

#### Script

Similar to Contract but runs arbitrary bytecode that may or may not be deployed already

## Visit [Docs](https://tevm.dev/) for docs, guides, API and more!

## See [Tevm Beta project board](https://github.com/orgs/tevm/projects/1) for progress on the upcoming beta release

## License 📄

<a href="./LICENSE"><img src="https://user-images.githubusercontent.com/35039927/231030761-66f5ce58-a4e9-4695-b1fe-255b1bceac92.png" width="200" /></a>
