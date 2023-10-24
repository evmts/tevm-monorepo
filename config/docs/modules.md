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

## Type Aliases

### CompilerConfig

Ƭ **CompilerConfig**: `Object`

Configuration of the solidity compiler
When resolved with defaults it is a [ResolvedCompilerConfig](/reference/config/modules.md#resolvedcompilerconfig)

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `foundryProject?` | `boolean` \| `string` | If set to true it will resolve forge remappings and libs Set to "path/to/forge/executable" to use a custom forge executable |
| `libs?` | readonly `string`[] | Sets directories to search for solidity imports in Read autoamtically for forge projects if forge: true |
| `remappings?` | `ReadonlyRecord`<`string`\> | Remap the location of contracts |

#### Defined in

[types.ts:11](https://github.com/evmts/evmts-monorepo/blob/main/config/src/types.ts#L11)

___

### ResolvedCompilerConfig

Ƭ **ResolvedCompilerConfig**: `Object`

A fully resolved compiler config with defaults filled in
See [CompilerConfig](/reference/config/modules.md#compilerconfig)

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `foundryProject` | `boolean` \| `string` | If set to true it will resolve forge remappings and libs Set to "path/to/forge/executable" to use a custom forge executable |
| `libs` | readonly `string`[] | Sets directories to search for solidity imports in Read autoamtically for forge projects if forge: true |
| `remappings` | `ReadonlyRecord`<`string`\> | Remap the location of contracts |

#### Defined in

[types.ts:37](https://github.com/evmts/evmts-monorepo/blob/main/config/src/types.ts#L37)

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

[config/withDefaults.js:6](https://github.com/evmts/evmts-monorepo/blob/main/config/src/config/withDefaults.js#L6)

## Functions

### defineConfig

▸ **defineConfig**(`configFactory`): `Object`

Typesafe way to create an EVMts CompilerConfig

#### Parameters

| Name | Type |
| :------ | :------ |
| `configFactory` | `ConfigFactory` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `configFn` | (`configFilePath`: `string`) => `Effect`<`never`, `DefineConfigError`, [`ResolvedCompilerConfig`](/reference/config/modules.md#resolvedcompilerconfig)\> |

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

[types.ts:68](https://github.com/evmts/evmts-monorepo/blob/main/config/src/types.ts#L68)

___

### loadConfig

▸ **loadConfig**(`configFilePath`): `Effect`<`never`, `LoadConfigError`, [`ResolvedCompilerConfig`](/reference/config/modules.md#resolvedcompilerconfig)\>

Loads an EVMts config from the given path

#### Parameters

| Name | Type |
| :------ | :------ |
| `configFilePath` | `string` |

#### Returns

`Effect`<`never`, `LoadConfigError`, [`ResolvedCompilerConfig`](/reference/config/modules.md#resolvedcompilerconfig)\>

**`Example`**

```ts
import {tap} from 'effect/Effect'
import {loadConfig} from '@evmts/config'

runPromise(loadConfig('./tsconfig.json')).pipe(
  tap(config => console.log(config))
)
```

#### Defined in

[loadConfig.js:61](https://github.com/evmts/evmts-monorepo/blob/main/config/src/loadConfig.js#L61)
