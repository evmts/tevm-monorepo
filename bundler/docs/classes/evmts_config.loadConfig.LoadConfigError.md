[Documentation](../README.md) / [Modules](../modules.md) / [@evmts/config](../modules/evmts_config.md) / [loadConfig](../modules/evmts_config.loadConfig.md) / LoadConfigError

# Class: LoadConfigError

[@evmts/config](../modules/evmts_config.md).[loadConfig](../modules/evmts_config.loadConfig.md).LoadConfigError

Error class for [loadConfig](../modules/evmts_config.loadConfig.md#loadconfig)

## Hierarchy

- `Error`

  ↳ **`LoadConfigError`**

## Table of contents

### Constructors

- [constructor](evmts_config.loadConfig.LoadConfigError.md#constructor)

### Properties

- [\_tag](evmts_config.loadConfig.LoadConfigError.md#_tag)
- [cause](evmts_config.loadConfig.LoadConfigError.md#cause)
- [message](evmts_config.loadConfig.LoadConfigError.md#message)
- [name](evmts_config.loadConfig.LoadConfigError.md#name)
- [stack](evmts_config.loadConfig.LoadConfigError.md#stack)
- [prepareStackTrace](evmts_config.loadConfig.LoadConfigError.md#preparestacktrace)
- [stackTraceLimit](evmts_config.loadConfig.LoadConfigError.md#stacktracelimit)

### Methods

- [captureStackTrace](evmts_config.loadConfig.LoadConfigError.md#capturestacktrace)

## Constructors

### constructor

• **new LoadConfigError**(`configFilePath`, `underlyingError`): [`LoadConfigError`](evmts_config.loadConfig.LoadConfigError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `configFilePath` | `string` |
| `underlyingError` | [`LoadConfigErrorType`](../modules/evmts_config.loadConfig.md#loadconfigerrortype) |

#### Returns

[`LoadConfigError`](evmts_config.loadConfig.LoadConfigError.md)

#### Overrides

Error.constructor

#### Defined in

[bundler/config/src/loadConfig.js:36](https://github.com/evmts/evmts-monorepo/blob/main/bundler/config/src/loadConfig.js#L36)

## Properties

### \_tag

• **\_tag**: ``"ConfigFnThrowError"`` \| ``"InvalidConfigError"`` \| ``"FoundryNotFoundError"`` \| ``"FoundryConfigError"`` \| ``"InvalidRemappingsError"`` \| ``"FailedToReadConfigError"`` \| ``"ParseJsonError"`` \| ``"NoPluginFoundError"``

#### Defined in

[bundler/config/src/loadConfig.js:31](https://github.com/evmts/evmts-monorepo/blob/main/bundler/config/src/loadConfig.js#L31)

___

### cause

• `Optional` **cause**: `unknown`

#### Inherited from

Error.cause

#### Defined in

node_modules/.pnpm/typescript@5.2.2/node_modules/typescript/lib/lib.es2022.error.d.ts:24

___

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

node_modules/.pnpm/typescript@5.2.2/node_modules/typescript/lib/lib.es5.d.ts:1068

___

### name

• **name**: ``"ConfigFnThrowError"`` \| ``"InvalidConfigError"`` \| ``"FoundryNotFoundError"`` \| ``"FoundryConfigError"`` \| ``"InvalidRemappingsError"`` \| ``"FailedToReadConfigError"`` \| ``"ParseJsonError"`` \| ``"NoPluginFoundError"``

#### Overrides

Error.name

#### Defined in

[bundler/config/src/loadConfig.js:27](https://github.com/evmts/evmts-monorepo/blob/main/bundler/config/src/loadConfig.js#L27)

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

node_modules/.pnpm/typescript@5.2.2/node_modules/typescript/lib/lib.es5.d.ts:1069

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

node_modules/.pnpm/@types+node@20.9.1/node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

node_modules/.pnpm/@types+node@20.9.1/node_modules/@types/node/globals.d.ts:13

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

node_modules/.pnpm/@types+node@20.9.1/node_modules/@types/node/globals.d.ts:4
