[**@tevm/tsupconfig**](../README.md)

***

[@tevm/tsupconfig](../globals.md) / createTsUpOptions

# Function: createTsUpOptions()

> **createTsUpOptions**(`options`): `Options`

Defined in: [createTsupOptions.js:14](https://github.com/evmts/tevm-monorepo/blob/main/configs/tsupconfig/src/createTsupOptions.js#L14)

Creates tsup options from params

## Parameters

### options

#### entry?

`string`[] = `...`

entry points Defaults to src/index.js

#### format?

(`"cjs"` \| `"esm"`)[] = `...`

module format Defaults to cjs and esm

#### outDir?

`string` = `'dist'`

output directory Defaults to dist

#### target?

`Target` = `'js'`

environment to target Defaults to js

## Returns

`Options`
