[@tevm/config](../README.md) / [Modules](../modules.md) / defineConfig

# Module: defineConfig

## Table of contents

### Classes

- [DefineConfigError](../classes/defineConfig.DefineConfigError.md)

### Functions

- [defineConfig](defineConfig.md#defineconfig)

## Functions

### defineConfig

▸ **defineConfig**(`configFactory`): `Object`

Typesafe way to create an Tevm CompilerConfig

#### Parameters

| Name | Type |
| :------ | :------ |
| `configFactory` | [`ConfigFactory`](types.md#configfactory) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `configFn` | (`configFilePath`: `string`) => `Effect`\<`never`, [`DefineConfigError`](../classes/defineConfig.DefineConfigError.md), [`ResolvedCompilerConfig`](types.md#resolvedcompilerconfig)\> |

**`Example`**

```ts
import { defineConfig } from '@tevm/ts-plugin'

export default defineConfig(() => ({
	lib: ['lib'],
	remappings: {
	  'foo': 'foo/bar'
	}
})
```

#### Defined in

[evmts-monorepo/bundler-packages/config/src/defineConfig.js:52](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/config/src/defineConfig.js#L52)
