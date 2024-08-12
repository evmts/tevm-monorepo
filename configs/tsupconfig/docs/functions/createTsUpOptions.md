[**@tevm/tsupconfig**](../README.md) • **Docs**

***

[@tevm/tsupconfig](../globals.md) / createTsUpOptions

# Function: createTsUpOptions()

> **createTsUpOptions**(`options`): `Options`

## Parameters

• **options**

• **options.entry**: `undefined` \| `string`[] = `...`

entry points Defaults to src/index.js

• **options.format**: `undefined` \| (`"cjs"` \| `"esm"`)[] = `...`

module format Defaults to cjs and esm

• **options.outDir**: `undefined` \| `string` = `'dist'`

output directory Defaults to dist

• **options.target**: `undefined` \| `Target` = `'js'`

environment to target Defaults to js

## Returns

`Options`

## Defined in

[createTsupOptions.js:14](https://github.com/evmts/tevm-monorepo/blob/main/configs/tsupconfig/src/createTsupOptions.js#L14)
