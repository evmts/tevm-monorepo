[Documentation](../README.md) / [Modules](../modules.md) / @tevm/bun-plugin

# Module: @tevm/bun-plugin

## Table of contents

### Functions

- [tevmBunPlugin](tevm_bun_plugin.md#tevmbunplugin)

## Functions

### tevmBunPlugin

▸ **tevmBunPlugin**(): `BunPlugin`

@tevm/bun-plugin is a bun plugin that allows you to import solidity files into your typescript files
and have them compiled to typescript on the fly.

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

[plugin.js:22](https://github.com/evmts/tevm-monorepo/blob/main/bundler/bun/src/plugin.js#L22)
