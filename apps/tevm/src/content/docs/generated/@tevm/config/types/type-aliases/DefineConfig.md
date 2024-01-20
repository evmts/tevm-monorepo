---
editUrl: false
next: false
prev: false
title: "DefineConfig"
---

> **DefineConfig**: (`configFactory`) => `object`

Creates an Tevm config
Takes a user provided configFactory

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
import { defineConfig } from 'tevm/config'
export default defineConfig({
	foundryProject: true,
		libs: ['libs/contracts'],
	})
```

## Source

[bundler/config/src/types.ts:84](https://github.com/evmts/tevm-monorepo/blob/main/bundler/config/src/types.ts#L84)

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
