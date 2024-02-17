[@tevm/bundler](../README.md) / [Modules](../modules.md) / config

# Module: config

## Table of contents

### Namespaces

- [defaultConfig](config.defaultConfig.md)

### Type Aliases

- [CompilerConfig](config.md#compilerconfig)
- [ResolvedCompilerConfig](config.md#resolvedcompilerconfig)

### Functions

- [defineConfig](config.md#defineconfig)
- [loadConfig](config.md#loadconfig)

## Type Aliases

### CompilerConfig

Ƭ **CompilerConfig**: `CompilerConfig`

#### Defined in

bundler-packages/config/types/index.d.ts:4

___

### ResolvedCompilerConfig

Ƭ **ResolvedCompilerConfig**: `ResolvedCompilerConfig`

#### Defined in

bundler-packages/config/types/index.d.ts:5

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
| `configFn` | (`configFilePath`: `string`) => `Effect`\<`never`, `DefineConfigError`, `ResolvedCompilerConfig`\> |

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

bundler-packages/config/types/defineConfig.d.ts:38

___

### loadConfig

▸ **loadConfig**(`configFilePath`): `Effect`

#### Parameters

| Name | Type |
| :------ | :------ |
| `configFilePath` | `string` |

#### Returns

`Effect`

#### Defined in

bundler-packages/config/types/loadConfig.d.ts:23
