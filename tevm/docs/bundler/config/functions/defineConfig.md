**tevm** ∙ [README](../../../README.md) ∙ [API](../../../API.md)

***

[API](../../../API.md) > [bundler/config](../README.md) > defineConfig

# Function: defineConfig()

> **defineConfig**(`configFactory`): `object`

Typesafe way to create an Tevm CompilerConfig

## Parameters

▪ **configFactory**: `ConfigFactory`

## Returns

> ### configFn
>
> > **configFn**: (`configFilePath`) => `Effect`\<`never`, `DefineConfigError`, `ResolvedCompilerConfig`\>
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

bundler/config/types/defineConfig.d.ts:35

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
