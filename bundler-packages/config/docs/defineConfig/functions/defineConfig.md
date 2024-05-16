[**@tevm/config**](../../README.md) • **Docs**

***

[@tevm/config](../../modules.md) / [defineConfig](../README.md) / defineConfig

# Function: defineConfig()

> **defineConfig**(`configFactory`): `object`

Typesafe way to create an Tevm CompilerConfig

## Parameters

• **configFactory**: [`ConfigFactory`](../../types/type-aliases/ConfigFactory.md)

## Returns

`object`

### configFn()

> **configFn**: (`configFilePath`) => `Effect`\<`never`, [`DefineConfigError`](../classes/DefineConfigError.md), [`ResolvedCompilerConfig`](../../types/type-aliases/ResolvedCompilerConfig.md)\>

#### Parameters

• **configFilePath**: `string`

#### Returns

`Effect`\<`never`, [`DefineConfigError`](../classes/DefineConfigError.md), [`ResolvedCompilerConfig`](../../types/type-aliases/ResolvedCompilerConfig.md)\>

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

[bundler-packages/config/src/defineConfig.js:48](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/config/src/defineConfig.js#L48)
