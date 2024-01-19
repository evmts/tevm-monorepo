**@tevm/bun-plugin** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > tevmBunPlugin

# Function: tevmBunPlugin()

> **tevmBunPlugin**(`SolcVersions`): `BunPlugin`

@tevm/bun-plugin is a bun plugin that allows you to import solidity files into your typescript files
and have them compiled to typescript on the fly.

## Parameters

▪ **SolcVersions**: `object`

▪ **SolcVersions.solc?**: `SolcVersions$1`

## Returns

## Example

```ts plugin.ts
import { tevmBunPlugin } from '@tevm/esbuild-plugin'
import { plugin } from 'bun'

plugin(tevmBunPlugin())
```

```ts bunfig.toml
preload = ["./plugins.ts"]
```

## Source

[plugin.js:27](https://github.com/evmts/tevm-monorepo/blob/main/bundler/bun/src/plugin.js#L27)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
