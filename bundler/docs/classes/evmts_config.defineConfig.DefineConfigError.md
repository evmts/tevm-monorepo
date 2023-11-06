[Documentation](../README.md) / [Modules](../modules.md) / [@evmts/config](../modules/evmts_config.md) / [defineConfig](../modules/evmts_config.defineConfig.md) / DefineConfigError

# Class: DefineConfigError

[@evmts/config](../modules/evmts_config.md).[defineConfig](../modules/evmts_config.defineConfig.md).DefineConfigError

Error class for [defineConfig](../modules/evmts_config.defineConfig.md#defineconfig)

## Hierarchy

- `Error`

  ↳ **`DefineConfigError`**

## Table of contents

### Constructors

- [constructor](evmts_config.defineConfig.DefineConfigError.md#constructor)

### Properties

- [\_tag](evmts_config.defineConfig.DefineConfigError.md#_tag)
- [cause](evmts_config.defineConfig.DefineConfigError.md#cause)
- [message](evmts_config.defineConfig.DefineConfigError.md#message)
- [name](evmts_config.defineConfig.DefineConfigError.md#name)
- [stack](evmts_config.defineConfig.DefineConfigError.md#stack)
- [prepareStackTrace](evmts_config.defineConfig.DefineConfigError.md#preparestacktrace)
- [stackTraceLimit](evmts_config.defineConfig.DefineConfigError.md#stacktracelimit)

### Methods

- [captureStackTrace](evmts_config.defineConfig.DefineConfigError.md#capturestacktrace)

## Constructors

### constructor

• **new DefineConfigError**(`configFilePath`, `underlyingError`): [`DefineConfigError`](evmts_config.defineConfig.DefineConfigError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `configFilePath` | `string` |
| `underlyingError` | [`DefineConfigErrorType`](../modules/evmts_config.types.md#defineconfigerrortype) |

#### Returns

[`DefineConfigError`](evmts_config.defineConfig.DefineConfigError.md)

#### Overrides

Error.constructor

#### Defined in

[bundler/config/src/defineConfig.js:26](https://github.com/evmts/evmts-monorepo/blob/main/bundler/config/src/defineConfig.js#L26)

## Properties

### \_tag

• **\_tag**: ``"ConfigFnThrowError"`` \| ``"InvalidConfigError"`` \| ``"FoundryNotFoundError"`` \| ``"FoundryConfigError"`` \| ``"InvalidRemappingsError"``

#### Defined in

[bundler/config/src/defineConfig.js:21](https://github.com/evmts/evmts-monorepo/blob/main/bundler/config/src/defineConfig.js#L21)

___

### cause

• `Optional` **cause**: `unknown`

#### Inherited from

Error.cause

#### Defined in

node_modules/typescript/lib/lib.es2022.error.d.ts:24

___

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1068

___

### name

• **name**: ``"ConfigFnThrowError"`` \| ``"InvalidConfigError"`` \| ``"FoundryNotFoundError"`` \| ``"FoundryConfigError"`` \| ``"InvalidRemappingsError"``

#### Overrides

Error.name

#### Defined in

[bundler/config/src/defineConfig.js:17](https://github.com/evmts/evmts-monorepo/blob/main/bundler/config/src/defineConfig.js#L17)

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1069

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

**`See`**

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

Error.prepareStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

node_modules/@types/node/globals.d.ts:13

## Methods

### captureStackTrace

▸ **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

Error.captureStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:4
