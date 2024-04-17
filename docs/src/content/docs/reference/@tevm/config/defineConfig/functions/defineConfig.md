---
editUrl: false
next: false
prev: false
title: "defineConfig"
---

> **defineConfig**(`configFactory`): `object`

Typesafe way to create an Tevm CompilerConfig

## Parameters

• **configFactory**: [`ConfigFactory`](/reference/types/type-aliases/configfactory/)

## Returns

`object`

### configFn()

> **configFn**: (`configFilePath`) => `Effect`\<`never`, [`DefineConfigError`](/reference/classes/defineconfigerror/), [`ResolvedCompilerConfig`](/reference/types/type-aliases/resolvedcompilerconfig/)\>

#### Parameters

• **configFilePath**: `string`

#### Returns

`Effect`\<`never`, [`DefineConfigError`](/reference/classes/defineconfigerror/), [`ResolvedCompilerConfig`](/reference/types/type-aliases/resolvedcompilerconfig/)\>

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

[bundler-packages/config/src/defineConfig.js:52](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/config/src/defineConfig.js#L52)
