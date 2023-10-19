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
- [loadConfigAsync](/reference/config/modules.md#loadconfigasync)

## Type Aliases

### CompilerConfig

Ƭ **CompilerConfig**: `Object`

Configuration of the solidity compiler

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `foundryProject?` | `boolean` \| `string` | If set to true it will resolve forge remappings and libs Set to "path/to/forge/executable" to use a custom forge executable |
| `libs?` | `string`[] | Sets directories to search for solidity imports in Read autoamtically for forge projects if forge: true |
| `remappings?` | `Record`<`string`, `string`\> | Remap the location of contracts |
| `solcVersion?` | `string` | Solc version to use (e.g. "0.8.13") **`Defaults`** "0.8.13" **`See`** https://www.npmjs.com/package/solc |

#### Defined in

[types.ts:6](https://github.com/evmts/evmts-monorepo/blob/main/config/src/types.ts#L6)

___

### ResolvedCompilerConfig

Ƭ **ResolvedCompilerConfig**: `Required`<[`CompilerConfig`](/reference/config/modules.md#compilerconfig)\>

#### Defined in

[types.ts:29](https://github.com/evmts/evmts-monorepo/blob/main/config/src/types.ts#L29)

## Variables

### defaultConfig

• `Const` **defaultConfig**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `foundryProject` | `boolean` |
| `libs` | `never`[] |
| `remappings` | {} |
| `get solcVersion()` | `string` |

#### Defined in

[Config.js:14](https://github.com/evmts/evmts-monorepo/blob/main/config/src/Config.js#L14)

## Functions

### defineConfig

▸ **defineConfig**(`configFactory`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `configFactory` | () => [`CompilerConfig`](/reference/config/modules.md#compilerconfig) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `configFn` | (`configFilePath`: `string`) => `Required`<[`CompilerConfig`](/reference/config/modules.md#compilerconfig)\> |

#### Defined in

[types.ts:31](https://github.com/evmts/evmts-monorepo/blob/main/config/src/types.ts#L31)

___

### loadConfig

▸ **loadConfig**(`configFilePath`, `logger?`): `Required`<[`CompilerConfig`](/reference/config/modules.md#compilerconfig)\>

Asyncronously loads an EVMts config from the given path

#### Parameters

| Name | Type |
| :------ | :------ |
| `configFilePath` | `string` |
| `logger?` | `Pick`<`Console`, ``"error"`` \| ``"warn"``\> |

#### Returns

`Required`<[`CompilerConfig`](/reference/config/modules.md#compilerconfig)\>

#### Defined in

[types.ts:35](https://github.com/evmts/evmts-monorepo/blob/main/config/src/types.ts#L35)

___

### loadConfigAsync

▸ **loadConfigAsync**(`configFilePath`, `logger?`, `fileExists?`): `Promise`<`Required`<[`CompilerConfig`](/reference/config/modules.md#compilerconfig)\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `configFilePath` | `string` |
| `logger?` | `Pick`<`Console`, ``"error"`` \| ``"warn"``\> |
| `fileExists?` | (`path`: `string`) => `Promise`<`boolean`\> |

#### Returns

`Promise`<`Required`<[`CompilerConfig`](/reference/config/modules.md#compilerconfig)\>\>

#### Defined in

[types.ts:40](https://github.com/evmts/evmts-monorepo/blob/main/config/src/types.ts#L40)
