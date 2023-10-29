@evmts/vite-plugin / [Exports](modules.md)

# @evmts/plugin

A rollup plugin for importing solidity files.

Currently @evmts/plugin only works in forge projects but work to make it support [all wagmi plugins](https://wagmi.sh/cli/plugins) is underway

## Instalation

```bash
pnpm i @evmts/rollup-plugin
```

## Vite usage

Install rollup plugin

```bash
npm i @evmts/rollup-plugin
```

Add to your vite config

```typescript
import { evmtsPluginrollup } from '@evmts/rollup-plugin`
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [evmtsPluginRollup()]
})
```

## Rollup usage

```typescript
const { evmtsPlugin } = require('@evmts/plugin');

module.exports = {
  ...
  plugins: [evmtsPlugin()]
};
```

## ConfigOptions

To configure pass in the forge executable and the root folder that your foundery.toml is in

```typescript
plugins: [
  evmtsPlugin({
    forgeExecutable: "forge",
    projectRoot: __dirname,
  }),
];
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
};
```

The typescript can then go ahead and use the artifacts however it pleases

## Usage in @evmts/core

See full [evms-core](https://github.com/evmts/evmts-monorepo-monorepo/tree/main/docs/evmts) for how it's used in evmts. This plugin can be used in other repos as well.

## Usage in other libraries

Currently only `@evmts/core` is using this but this could easily be adapted or extended for other libraries.

## Autocompletion and Typesafety

For typesafety and autocompletion in your editor add [@evmts/ts-plugin](https://github.com/evmts/evmts-monorepo/tree/main/ts-plugin) to your tsconfig.json.

**Custom Ts plugins are for developer experience only**

The typescript compiler does not use custom ts plugins at compile time only in your editor. You will get red squiggly lines telling you something is wrong but it will still compile.

## License 📄

<a href="./LICENSE"><img src="https://user-images.githubusercontent.com/35039927/231030761-66f5ce58-a4e9-4695-b1fe-255b1bceac92.png" width="200" /></a>
