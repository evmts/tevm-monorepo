[@evmts/config](../README.md) / [Modules](../modules.md) / defineConfig

# Module: defineConfig

## Table of contents

### Classes

- [DefineConfigError](../classes/defineConfig.DefineConfigError.md)

### Functions

- [defineConfig](defineConfig.md#defineconfig)

## Functions

### defineConfig

▸ **defineConfig**(`configFactory`): `Object`

Typesafe way to create an EVMts CompilerConfig

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
import { defineConfig } from '@evmts/ts-plugin'

export default defineConfig(() => ({
	lib: ['lib'],
	remappings: {
	  'foo': 'foo/bar'
	}
})
```

#### Defined in

[bundler/config/src/types.ts:76](https://github.com/evmts/evmts-monorepo/blob/main/bundler/config/src/types.ts#L76)
