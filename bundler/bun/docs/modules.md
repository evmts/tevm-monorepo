[@tevm/bun-plugin](README.md) / Exports

# @tevm/bun-plugin

## Table of contents

### Functions

- [tevmBunPlugin](modules.md#tevmbunplugin)

## Functions

### tevmBunPlugin

▸ **tevmBunPlugin**(`SolcVersions`): `BunPlugin`

@tevm/bun-plugin is a bun plugin that allows you to import solidity files into your typescript files
and have them compiled to typescript on the fly.

#### Parameters

| Name | Type |
| :------ | :------ |
| `SolcVersions` | `Object` |
| `SolcVersions.solc?` | `SolcVersions` |

#### Returns

`BunPlugin`

**`Example`**

```ts plugin.ts
import { tevmBunPlugin } from '@tevm/esbuild-plugin'
import { plugin } from 'bun'

plugin(tevmBunPlugin())
```

```ts bunfig.toml
preload = ["./plugins.ts"]
```

#### Defined in

[plugin.js:26](https://github.com/evmts/tevm-monorepo/blob/main/bundler/bun/src/plugin.js#L26)
