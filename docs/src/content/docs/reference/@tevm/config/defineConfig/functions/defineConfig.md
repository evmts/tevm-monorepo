---
editUrl: false
next: false
prev: false
title: "defineConfig"
---

> **defineConfig**(`configFactory`): `object`

Typesafe way to create an Tevm CompilerConfig

## Parameters

• **configFactory**: [`ConfigFactory`](/reference/tevm/config/types/type-aliases/configfactory/)

## Returns

`object`

### configFn()

> **configFn**: (`configFilePath`) => `Effect`\<[`ResolvedCompilerConfig`](/reference/tevm/config/types/type-aliases/resolvedcompilerconfig/), [`DefineConfigError`](/reference/tevm/config/defineconfig/classes/defineconfigerror/), `never`\>

#### Parameters

• **configFilePath**: `string`

#### Returns

`Effect`\<[`ResolvedCompilerConfig`](/reference/tevm/config/types/type-aliases/resolvedcompilerconfig/), [`DefineConfigError`](/reference/tevm/config/defineconfig/classes/defineconfigerror/), `never`\>

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

## Defined in

[bundler-packages/config/src/defineConfig.js:48](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/config/src/defineConfig.js#L48)
