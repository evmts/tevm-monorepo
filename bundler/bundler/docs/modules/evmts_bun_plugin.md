[Documentation](../README.md) / [Modules](../modules.md) / @evmts/bun-plugin

# Module: @evmts/bun-plugin

## Table of contents

### Functions

- [evmtsBunPlugin](evmts_bun_plugin.md#evmtsbunplugin)

## Functions

### evmtsBunPlugin

▸ **evmtsBunPlugin**(): `BunPlugin`

@evmts/bun-plugin is a bun plugin that allows you to import solidity files into your typescript files
and have them compiled to typescript on the fly.

#### Returns

`BunPlugin`

**`Example`**

```ts plugin.ts
import { evmtsBunPlugin } from '@evmts/esbuild-plugin'
import { plugin } from 'bun'

plugin(evmtsBunPlugin())
```

```ts bunfig.toml
preload = ["./plugins.ts"]
```

#### Defined in

[plugin.js:22](https://github.com/evmts/evmts-monorepo/blob/main/bundler/bun/src/plugin.js#L22)
