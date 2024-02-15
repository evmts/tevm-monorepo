**@tevm/tsupconfig** ∙ [README](../README.md) ∙ [API](../API.md)

***

[API](../API.md) > createTsUpOptions

# Function: createTsUpOptions()

> **createTsUpOptions**(`options`): `Options`

Creates tsup options from params

## Parameters

▪ **options**: `object`

▪ **options.entry**: `undefined` \| `string`[]

entry points Defaults to src/index.js

▪ **options.format**: `undefined` \| (`"cjs"` \| `"esm"`)[]

module format Defaults to cjs and esm

▪ **options.outDir**: `undefined` \| `string`

output directory Defaults to dist

▪ **options.target**: `undefined` \| `Target`

environment to target Defaults to js

## Returns

## Source

[createTsupOptions.js:14](https://github.com/evmts/tevm-monorepo/blob/main/configs/tsupconfig/src/createTsupOptions.js#L14)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
