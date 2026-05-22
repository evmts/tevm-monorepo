[**tevm**](../../../README.md)

***

[tevm](../../../modules.md) / [bundler/config](../README.md) / defineConfig

# Variable: defineConfig

> `const` **defineConfig**: `DefineConfig`

Typesafe way to create an Tevm CompilerConfig

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
