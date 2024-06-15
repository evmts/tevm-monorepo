[**tevm**](../../../README.md) • **Docs**

***

[tevm](../../../modules.md) / [bundler/config](../README.md) / defineConfig

# Function: defineConfig()

> **defineConfig**(`configFactory`): `object`

Typesafe way to create an Tevm CompilerConfig

## Parameters

• **configFactory**: `ConfigFactory`

## Returns

`object`

### configFn()

> **configFn**: (`configFilePath`) => `Effect`\<`never`, `DefineConfigError`, `ResolvedCompilerConfig`\>

#### Parameters

• **configFilePath**: `string`

#### Returns

`Effect`\<`never`, `DefineConfigError`, `ResolvedCompilerConfig`\>

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

bundler-packages/config/types/defineConfig.d.ts:35
