# @evmts/plugin-webpack

A webpack plugin for importing solidity files.

## Instalation

```bash
pnpm i @evmts/plugin-webpack
```

## Webpack usage

Install webpack plugin

```bash
npm i @evmts/plugin-webpack
```

Add to your webpack config

```typescript
import { EvmTsPlugin } from '@evmts/plugin-webpack`
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    new EvmTsPlugin()
  ]
})
```

## NEXT.js Usage

To use in next add to `next.config.js`

```typescript
import { EvmTsPlugin } from "@evmts/webpackPlugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    config.plugins.push(new EvmTsPlugin({}));
    return config;
  },
};

module.exports = nextConfig;
```

## How it works

Under the hood this plugin will transform solidity imports

When the plugin sees a solidity import it will make the following changes

1. Update the import to import a .ts file

```typescript
- import scripts from './MyScript.sol'
+ import scripts from './MyScript.sol.ts'
```

Insert a new typescript file MyScript.sol.ts as an artifact

```typescript
// MyScript.sol.ts
export default {
  name,
  artifactPath,
  contractPath,
  address,
  abi,
  bytecode,
};
```

The typescript can then go ahead and use the artifacts however it pleases

## Usage in @evmts/core

See full [evms-core](https://github.com/evmts/evmts-monorepo-monorepo/tree/main/docs/evmts) for how it's used in evmts. This plugin can be used in other repos as well.

## Usage in other libraries

Currently only `@evmts/core` is using this but this could easily be adapted or extended for other libraries.

## Autocompletion and Typesafety

For typesafety and autocompletion in your editor add [@evmts/ts-plugin](https://github.com/evmts/evmts-monorepo-monorepo/tree/main/packages/ts-plugin) to your tsconfig.json.

**Custom Ts plugins are for developer experience only**

The typescript compiler does not use custom ts plugins at compile time only in your editor. You will get red squiggly lines telling you something is wrong but it will still compile.

## Other plugins

See [plugin-rollup](https://github.com/evmts/evmts-monorepo-monorepo/tree/main/packages/plugin-rollup) if using vitest, vite, or rollup
