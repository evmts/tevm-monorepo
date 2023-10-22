[@evmts/config](/reference/config/README.md) / Exports

# @evmts/config

## Table of contents

### Type Aliases

- [CompilerConfig](/reference/config/modules.md#compilerconfig)
- [ResolvedCompilerConfig](/reference/config/modules.md#resolvedcompilerconfig)

### Variables

- [defaultConfig](/reference/config/modules.md#defaultconfig)

### Functions

- [defineConfig](/reference/config/modules.md#defineconfig)
- [loadConfig](/reference/config/modules.md#loadconfig)
- [mergeConfigs](/reference/config/modules.md#mergeconfigs)

## Type Aliases

### CompilerConfig

Ƭ **CompilerConfig**: `Object`

Configuration of the solidity compiler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `foundryProject?` | `boolean` \| `string` | If set to true it will resolve forge remappings and libs Set to "path/to/forge/executable" to use a custom forge executable |
| `libs?` | readonly `string`[] | Sets directories to search for solidity imports in Read autoamtically for forge projects if forge: true |
| `remappings?` | `ReadonlyRecord`<`string`\> | Remap the location of contracts |

#### Defined in

[types.ts:10](https://github.com/evmts/evmts-monorepo/blob/main/config/src/types.ts#L10)

___

### ResolvedCompilerConfig

Ƭ **ResolvedCompilerConfig**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `foundryProject` | `boolean` \| `string` | If set to true it will resolve forge remappings and libs Set to "path/to/forge/executable" to use a custom forge executable |
| `libs` | readonly `string`[] | Sets directories to search for solidity imports in Read autoamtically for forge projects if forge: true |
| `remappings` | `ReadonlyRecord`<`string`\> | Remap the location of contracts |

#### Defined in

[types.ts:32](https://github.com/evmts/evmts-monorepo/blob/main/config/src/types.ts#L32)

## Variables

### defaultConfig

• `Const` **defaultConfig**: `Object`

The default CompilerConfig

#### Type declaration

| Name | Type |
| :------ | :------ |
| `foundryProject` | `boolean` |
| `libs` | `never`[] |
| `remappings` | {} |

#### Defined in

[utils/withDefaults.js:6](https://github.com/evmts/evmts-monorepo/blob/main/config/src/utils/withDefaults.js#L6)

## Functions

### defineConfig

▸ **defineConfig**(`configFactory`): `Object`

Used in evmts.config.ts to create a config

#### Parameters

| Name | Type |
| :------ | :------ |
| `configFactory` | `ConfigFactory` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `configFn` | (`configFilePath`: `string`) => `Effect`<`never`, `LoadFoundryConfigError` \| `ValidateUserConfigError`, [`ResolvedCompilerConfig`](/reference/config/modules.md#resolvedcompilerconfig)\> |

**`Example`**

```ts
import { defineConfig } from '@evmts/ts-plugin'

export default defineConfig(() => ({
	lib: ['lib'],
	remappings: {
	  'foo': 'foo/bar'
	}
})

#### Defined in

[types.ts:49](https://github.com/evmts/evmts-monorepo/blob/main/config/src/types.ts#L49)

___

### loadConfig

▸ **loadConfig**(`configFilePath`): `Effect`<`never`, `LoadConfigError`, [`ResolvedCompilerConfig`](/reference/config/modules.md#resolvedcompilerconfig)\>

Asyncronously loads an EVMts config from the given path

#### Parameters

| Name | Type |
| :------ | :------ |
| `configFilePath` | `string` |

#### Returns

`Effect`<`never`, `LoadConfigError`, [`ResolvedCompilerConfig`](/reference/config/modules.md#resolvedcompilerconfig)\>

#### Defined in

[loadConfig.js:17](https://github.com/evmts/evmts-monorepo/blob/main/config/src/loadConfig.js#L17)

___

### mergeConfigs

▸ **mergeConfigs**(`configs`): `Effect`<`never`, `never`, [`CompilerConfig`](/reference/config/modules.md#compilerconfig)\>

Merges multiple configs into a single config
The last config in the list takes precedence on any given property

#### Parameters

| Name | Type |
| :------ | :------ |
| `configs` | [`CompilerConfig`](/reference/config/modules.md#compilerconfig)[] |

#### Returns

`Effect`<`never`, `never`, [`CompilerConfig`](/reference/config/modules.md#compilerconfig)\>

**`Example`**

```ts
const userConfig = { remappings: { key1: 'value1' }, libs: ['lib1'] };
const foundryConfig = { remappings: { key2: 'value2' }, libs: ['lib2', 'lib1'], foundryProject: 'forge' };
const mergedConfig = mergeConfigs([userConfig, foundryConfig]);
```

#### Defined in

[mergeConfigs.js:13](https://github.com/evmts/evmts-monorepo/blob/main/config/src/mergeConfigs.js#L13)
