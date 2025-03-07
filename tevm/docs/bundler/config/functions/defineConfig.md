[**tevm**](../../../README.md)

***

[tevm](../../../modules.md) / [bundler/config](../README.md) / defineConfig

# Function: defineConfig()

> **defineConfig**(`configFactory`): `object`

Defined in: bundler-packages/config/types/defineConfig.d.ts:35

Typesafe way to create an Tevm CompilerConfig

## Parameters

### configFactory

`ConfigFactory`

## Returns

`object`

### configFn()

> **configFn**: (`configFilePath`) => `Effect`\<`ResolvedCompilerConfig`, `DefineConfigError`, `never`\>

#### Parameters

##### configFilePath

`string`

#### Returns

`Effect`\<`ResolvedCompilerConfig`, `DefineConfigError`, `never`\>

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
