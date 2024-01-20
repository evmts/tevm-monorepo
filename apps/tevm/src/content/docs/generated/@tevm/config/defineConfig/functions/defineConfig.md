---
editUrl: false
next: false
prev: false
title: "defineConfig"
---

> **defineConfig**(`configFactory`): `object`

Typesafe way to create an Tevm CompilerConfig

## Parameters

▪ **configFactory**: [`ConfigFactory`](/generated/tevm/config/types/type-aliases/configfactory/)

## Returns

> ### configFn
>
> > **configFn**: (`configFilePath`) => `Effect`\<`never`, [`DefineConfigError`](/generated/tevm/config/defineconfig/classes/defineconfigerror/), [`ResolvedCompilerConfig`](/generated/tevm/config/types/type-aliases/resolvedcompilerconfig/)\>
>
> #### Parameters
>
> ▪ **configFilePath**: `string`
>

## Example

```ts
import { defineConfig } from '@tevm/ts-plugin'

export default defineConfig(() => ({
	lib: ['lib'],
	remappings: {
	  'foo': 'foo/bar'
	}
})
```

## Source

[bundler/config/src/defineConfig.js:52](https://github.com/evmts/tevm-monorepo/blob/main/bundler/config/src/defineConfig.js#L52)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
