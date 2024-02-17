[@tevm/config](../README.md) / [Modules](../modules.md) / types

# Module: types

## Table of contents

### Type Aliases

- [CompilerConfig](types.md#compilerconfig)
- [ConfigFactory](types.md#configfactory)
- [DefineConfig](types.md#defineconfig)
- [DefineConfigErrorType](types.md#defineconfigerrortype)
- [ResolvedCompilerConfig](types.md#resolvedcompilerconfig)

## Type Aliases

### CompilerConfig

Ƭ **CompilerConfig**: `Object`

Configuration of the solidity compiler
When resolved with defaults it is a [ResolvedCompilerConfig](types.md#resolvedcompilerconfig)

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `cacheDir?` | `string` | Location of the tevm cache folder |
| `debug?` | `boolean` | If debug is true tevm will write the .d.ts files in the ts server and publish extra debug info to a debug file |
| `foundryProject?` | `boolean` \| `string` | If set to true it will resolve forge remappings and libs Set to "path/to/forge/executable" to use a custom forge executable |
| `libs?` | readonly `string`[] | Sets directories to search for solidity imports in Read autoamtically for forge projects if forge: true |
| `remappings?` | `ReadonlyRecord`\<`string`\> | Remap the location of contracts |

#### Defined in

[evmts-monorepo/bundler-packages/config/src/types.ts:11](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/config/src/types.ts#L11)

___

### ConfigFactory

Ƭ **ConfigFactory**: () => [`CompilerConfig`](types.md#compilerconfig)

#### Type declaration

▸ (): [`CompilerConfig`](types.md#compilerconfig)

##### Returns

[`CompilerConfig`](types.md#compilerconfig)

#### Defined in

[evmts-monorepo/bundler-packages/config/src/types.ts:39](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/config/src/types.ts#L39)

___

### DefineConfig

Ƭ **DefineConfig**: (`configFactory`: [`ConfigFactory`](types.md#configfactory)) => \{ `configFn`: (`configFilePath`: `string`) => `Effect`\<`never`, [`DefineConfigError`](../classes/defineConfig.DefineConfigError.md), [`ResolvedCompilerConfig`](types.md#resolvedcompilerconfig)\>  }

Creates an Tevm config
Takes a user provided configFactory

**`Example`**

```ts
import { defineConfig } from 'tevm/config'
export default defineConfig({
	foundryProject: true,
		libs: ['libs/contracts'],
	})
```

#### Type declaration

▸ (`configFactory`): `Object`

##### Parameters

| Name | Type |
| :------ | :------ |
| `configFactory` | [`ConfigFactory`](types.md#configfactory) |

##### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `configFn` | (`configFilePath`: `string`) => `Effect`\<`never`, [`DefineConfigError`](../classes/defineConfig.DefineConfigError.md), [`ResolvedCompilerConfig`](types.md#resolvedcompilerconfig)\> |

#### Defined in

[evmts-monorepo/bundler-packages/config/src/types.ts:84](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/config/src/types.ts#L84)

___

### DefineConfigErrorType

Ƭ **DefineConfigErrorType**: `ValidateUserConfigError` \| `LoadFoundryConfigError`

#### Defined in

[evmts-monorepo/bundler-packages/config/src/types.ts:70](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/config/src/types.ts#L70)

___

### ResolvedCompilerConfig

Ƭ **ResolvedCompilerConfig**: `Object`

A fully resolved compiler config with defaults filled in
See [CompilerConfig](types.md#compilerconfig)

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `cacheDir` | `string` | Location of the tevm cache folder |
| `debug?` | `boolean` | If debug is true tevm will write the .d.ts files in the ts server and publish extra debug info to a debug file |
| `foundryProject` | `boolean` \| `string` | If set to true it will resolve forge remappings and libs Set to "path/to/forge/executable" to use a custom forge executable |
| `libs` | readonly `string`[] | Sets directories to search for solidity imports in Read autoamtically for forge projects if forge: true |
| `remappings` | `ReadonlyRecord`\<`string`\> | Remap the location of contracts |

#### Defined in

[evmts-monorepo/bundler-packages/config/src/types.ts:45](https://github.com/evmts/tevm-monorepo/blob/main/bundler-packages/config/src/types.ts#L45)
