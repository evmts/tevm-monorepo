[@evmts/config](/reference/config/README.md) / Exports

# @evmts/config

## Table of contents

### Type Aliases

- [CompilerConfig](/reference/config/modules.md#compilerconfig)
- [DefineConfig](/reference/config/modules.md#defineconfig)
- [LoadConfigAsync](/reference/config/modules.md#loadconfigasync)
- [ResolvedCompilerConfig](/reference/config/modules.md#resolvedcompilerconfig)

### Variables

- [CompilerConfigValidator](/reference/config/modules.md#compilerconfigvalidator)
- [defaultConfig](/reference/config/modules.md#defaultconfig)
- [huh](/reference/config/modules.md#huh)

### Functions

- [defineConfig](/reference/config/modules.md#defineconfig-1)
- [loadConfig](/reference/config/modules.md#loadconfig)
- [loadConfigAsync](/reference/config/modules.md#loadconfigasync-1)

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

[config/src/Config.ts:7](https://github.com/evmts/evmts-monorepo/blob/main/config/src/Config.ts#L7)

___

### DefineConfig

Ƭ **DefineConfig**: (`configFactory`: () => [`CompilerConfig`](/reference/config/modules.md#compilerconfig)) => { `configFn`: (`configFilePath`: `string`) => [`ResolvedCompilerConfig`](/reference/config/modules.md#resolvedcompilerconfig)  }

#### Type declaration

▸ (`configFactory`): `Object`

##### Parameters

| Name | Type |
| :------ | :------ |
| `configFactory` | () => [`CompilerConfig`](/reference/config/modules.md#compilerconfig) |

##### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `configFn` | (`configFilePath`: `string`) => [`ResolvedCompilerConfig`](/reference/config/modules.md#resolvedcompilerconfig) |

#### Defined in

[config/src/defineConfig.ts:10](https://github.com/evmts/evmts-monorepo/blob/main/config/src/defineConfig.ts#L10)

___

### LoadConfigAsync

Ƭ **LoadConfigAsync**: (`configFilePath`: `string`, `logger?`: `Pick`<typeof `console`, ``"error"`` \| ``"warn"``\>, `fileExists?`: typeof `defaultFileExists`) => `Promise`<[`ResolvedCompilerConfig`](/reference/config/modules.md#resolvedcompilerconfig)\>

#### Type declaration

▸ (`configFilePath`, `logger?`, `fileExists?`): `Promise`<[`ResolvedCompilerConfig`](/reference/config/modules.md#resolvedcompilerconfig)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `configFilePath` | `string` |
| `logger?` | `Pick`<typeof `console`, ``"error"`` \| ``"warn"``\> |
| `fileExists?` | typeof `defaultFileExists` |

##### Returns

`Promise`<[`ResolvedCompilerConfig`](/reference/config/modules.md#resolvedcompilerconfig)\>

#### Defined in

[config/src/loadConfigAsync.ts:8](https://github.com/evmts/evmts-monorepo/blob/main/config/src/loadConfigAsync.ts#L8)

___

### ResolvedCompilerConfig

Ƭ **ResolvedCompilerConfig**: `Required`<[`CompilerConfig`](/reference/config/modules.md#compilerconfig)\>

#### Defined in

[config/src/Config.ts:30](https://github.com/evmts/evmts-monorepo/blob/main/config/src/Config.ts#L30)

## Variables

### CompilerConfigValidator

• `Const` **CompilerConfigValidator**: `ZodObject`<{ `foundryProject`: `ZodOptional`<`ZodUnion`<[`ZodBoolean`, `ZodString`]\>\> ; `libs`: `ZodOptional`<`ZodArray`<`ZodString`, ``"many"``\>\> ; `name`: `ZodOptional`<`ZodLiteral`<``"@evmts/ts-plugin"``\>\> ; `remappings`: `ZodOptional`<`ZodRecord`<`ZodString`, `ZodString`\>\> ; `solcVersion`: `ZodOptional`<`ZodString`\>  }, ``"strict"``, `ZodTypeAny`, { `foundryProject?`: `string` \| `boolean` ; `libs?`: `string`[] ; `name?`: ``"@evmts/ts-plugin"`` ; `remappings?`: `Record`<`string`, `string`\> ; `solcVersion?`: `string`  }, { `foundryProject?`: `string` \| `boolean` ; `libs?`: `string`[] ; `name?`: ``"@evmts/ts-plugin"`` ; `remappings?`: `Record`<`string`, `string`\> ; `solcVersion?`: `string`  }\>

#### Defined in

[config/src/Config.ts:32](https://github.com/evmts/evmts-monorepo/blob/main/config/src/Config.ts#L32)

___

### defaultConfig

• `Const` **defaultConfig**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `foundryProject` | `boolean` |
| `libs` | `never`[] |
| `remappings` | {} |
| `get solcVersion()` | `any` |

#### Defined in

[config/src/Config.ts:42](https://github.com/evmts/evmts-monorepo/blob/main/config/src/Config.ts#L42)

___

### huh

• `Const` **huh**: ``"huh"``

#### Defined in

[config/src/index.ts:5](https://github.com/evmts/evmts-monorepo/blob/main/config/src/index.ts#L5)

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

[config/src/defineConfig.ts:10](https://github.com/evmts/evmts-monorepo/blob/main/config/src/defineConfig.ts#L10)

___

### loadConfig

▸ **loadConfig**(`configFilePath`, `logger?`): `Required`<[`CompilerConfig`](/reference/config/modules.md#compilerconfig)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `configFilePath` | `string` |
| `logger?` | `Pick`<`Console`, ``"error"`` \| ``"warn"``\> |

#### Returns

`Required`<[`CompilerConfig`](/reference/config/modules.md#compilerconfig)\>

#### Defined in

[config/src/loadConfig.ts:7](https://github.com/evmts/evmts-monorepo/blob/main/config/src/loadConfig.ts#L7)

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

[config/src/loadConfigAsync.ts:8](https://github.com/evmts/evmts-monorepo/blob/main/config/src/loadConfigAsync.ts#L8)
