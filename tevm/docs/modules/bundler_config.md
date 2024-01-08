[tevm](../README.md) / [Modules](../modules.md) / bundler/config

# Module: bundler/config

## Table of contents

### Namespaces

- [defaultConfig](bundler_config.defaultConfig.md)

### Type Aliases

- [CompilerConfig](bundler_config.md#compilerconfig)
- [ResolvedCompilerConfig](bundler_config.md#resolvedcompilerconfig)

### Functions

- [defineConfig](bundler_config.md#defineconfig)
- [loadConfig](bundler_config.md#loadconfig)

## Type Aliases

### CompilerConfig

Ƭ **CompilerConfig**: `CompilerConfig$1`

#### Defined in

bundler/config/dist/index.d.ts:312

___

### ResolvedCompilerConfig

Ƭ **ResolvedCompilerConfig**: `ResolvedCompilerConfig$1`

#### Defined in

bundler/config/dist/index.d.ts:313

## Functions

### defineConfig

▸ **defineConfig**(`configFactory`): `Object`

Typesafe way to create an Tevm CompilerConfig

#### Parameters

| Name | Type |
| :------ | :------ |
| `configFactory` | `ConfigFactory` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `configFn` | (`configFilePath`: `string`) => `Effect`\<`never`, `DefineConfigError`, `ResolvedCompilerConfig$1`\> |

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

bundler/config/dist/index.d.ts:210

___

### loadConfig

▸ **loadConfig**(`configFilePath`): `effect_Effect.Effect`\<`never`, `LoadConfigError`, `ResolvedCompilerConfig$1`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `configFilePath` | `string` |

#### Returns

`effect_Effect.Effect`\<`never`, `LoadConfigError`, `ResolvedCompilerConfig$1`\>

#### Defined in

bundler/config/dist/index.d.ts:309
