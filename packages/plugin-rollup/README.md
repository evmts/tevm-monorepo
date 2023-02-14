# @evmts/plugin-rollup

A rollup plugin for importing solidity files.

## Instalation

```bash
pnpm i @evmts/plugin-rollup
```

## Vite usage

Install rollup plugin

```bash
npm i @evmts/plugin-rollup
```

Add to your vite config

```typescript
import { tsSolPlugin } from '@evmts/plugin-rollup`
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [tsSolPlugin()]
})
```

## Rollup usage

```typescript
const { tsSolPlugin } = require('@evmts');

module.exports = {
  ...
  plugins: [tsSolPlugin()]
};
```

## How it works

Under the hood this plugin will transform solidity imports

This module import of a solidity script

```typescript
import scripts from './MyScript.sol.ts'
```

Transforms into this javascript object

```typescript
const scripts = {
  abi,
  bytecode,
  source,
}
```

## Usage in @evmts/core

See full [evms-core](https://github.com/evmts/evmts-monorepo-monorepo/tree/main/docs/evmts) for how it's used in evmts. This plugin can be used in other repos as well.

## Usage in other libraries

Currently only `@evmts/core` is using this but this could easily be adapted or extended for other libraries.

## Autocompletion and Typesafety

For typesafety and autocompletion in your editor add [@evmts/ts-plugin](https://github.com/evmts/evmts-monorepo-monorepo/tree/main/packages/ts-plugin) to your tsconfig.json.

**Custom Ts plugins are for developer experience only**

The typescript compiler does not use custom ts plugins at compile time only in your editor. You will get red squiggly lines telling you something is wrong but it will still compile.

## Other plugins

See [plugin-webpack](https://github.com/evmts/evmts-monorepo-monorepo/tree/main/packages/plugin-webpack) if using webpack
