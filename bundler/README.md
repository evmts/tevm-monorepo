# bundler/

## Overview

The [@evmts/bundler](./bundler/) is in charge of bundling all solidity code into typescript. It is how the imports of solidity files in TypeScript work.

```typescript
import { MyContract } from './MyContract.sol'
```

`@evmts/bundler` is broken up into a lot of smaller packages that are reported by the entrypoint package. The more granular packages are available for use on NPM but installing `@evmts/bundler` is the recomended approach for users.

## [@evmts/bundler](./bundler/)

This package simply exports the subpackages. It has no build linting or testing.

## [packages/](./packages/)

`@evmts/bundler` is built with a lot of smaller packages. It reexports the following packages

- [@evmts/bun](./packages/bun)
- [@evmts/config](./packages/config)
- [@evmts/esbuild](./packages/esbuild)
- [@evmts/rollup](./packages/rollup)
- [@evmts/rspack](./packages/rspack)
- [@evmts/ts-plugin](./packages/ts-plugin)
- [@evmts/vite](./packages/vite)
- [@evmts/webpack](./packages/webpack)

### Notable packages

#### [@evmts/base](./packages/base) 

The generalized solidity resolution code used to build all other bundlers and LSPs. 
It exports an object called [bundler](./packages/base/src/bundler.js) that can turn any solidity import into TypeScript code.

`@evmts/base` uses the following single-purpose packages to turn solidity imports into 

- [@evmts/solc](./packages/solc/) - Compiles solidity into `abis`, `asts`, and `bytecode` for the bundler to use
- [@evmts/resolutions](./packages/resolutions) - Resolves the import graph for solidity file imports
- [@evmts/runtime](./packages/runtime) - Transforms the resolved solidity compilations into the runtime code injected into TypeScript

In addition



The following packages in [bundler/packages](./packages/) are made public via exporting from [@evmts/bundler](./bundler/):

- [@evmts/bun](./packages/bun/) - A [bun](https://bun.sh/docs/bundler/plugins) plugin for importing solidity.

#### [@evmts/unplugin](./packages/unplugin)

A single [unplugin](https://github.com/unjs/unplugin) used to create most of the bundlers.

`unplugin` extends the excellent Rollup plugin API as the unified plugin interface and provides a compatible layer base on the build tools used with.

It is [very light wrapper](./packages/unplugin/src/evmtsUnplugin.js) around the general [base bundler](./packages/base) implementing the unplugin interface.

Unplugin is used to build the following packages:

- [@evmts/esbuild](./packages/esbuild)
- [@evmts/rollup](./packages/rollup)
- [@evmts/rspack](./packages/rspack)
- [@evmts/vite](./packages/vite)

#### [@evmts/bun](./packages/bun)

Bun plugin is implemented as a custom plugin using [the base bundler](./packages/bundler) with some file system related bun optimizations.

#### [@evmts/ts-plugin](./packages/ts-plugin)

The LSP for EVMts. The ts-plugin allows users to add the plugin to their ts-config and recieve editor support for EVMts imports.

It uses [the core @evmts/base](./packages/base) bundler to resolve .d.ts files and soldity ASTs to make the TypeScript type server work.
