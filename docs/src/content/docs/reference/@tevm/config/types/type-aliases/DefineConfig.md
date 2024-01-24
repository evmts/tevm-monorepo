---
editUrl: false
next: false
prev: false
title: "DefineConfig"
---

> **DefineConfig**: (`configFactory`) => `object`

Creates an Tevm config
Takes a user provided configFactory

## Example

```ts
import { defineConfig } from 'tevm/config'
export default defineConfig({
	foundryProject: true,
		libs: ['libs/contracts'],
	})
```

## Parameters

▪ **configFactory**: [`ConfigFactory`](/reference/tevm/config/types/type-aliases/configfactory/)

## Returns

> ### configFn
>
> > **configFn**: (`configFilePath`) => `Effect`\<`never`, [`DefineConfigError`](/reference/tevm/config/defineconfig/classes/defineconfigerror/), [`ResolvedCompilerConfig`](/reference/tevm/config/types/type-aliases/resolvedcompilerconfig/)\>
>
> #### Parameters
>
> ▪ **configFilePath**: `string`
>

## Source

[bundler-packages/config/src/types.ts:84](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/config/src/types.ts#L84)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
