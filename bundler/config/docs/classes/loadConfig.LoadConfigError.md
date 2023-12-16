[@tevm/config](../README.md) / [Modules](../modules.md) / [loadConfig](../modules/loadConfig.md) / LoadConfigError

# Class: LoadConfigError

[loadConfig](../modules/loadConfig.md).LoadConfigError

Error class for [loadConfig](../modules/loadConfig.md#loadconfig)

## Hierarchy

- `Error`

  ↳ **`LoadConfigError`**

## Table of contents

### Constructors

- [constructor](loadConfig.LoadConfigError.md#constructor)

### Properties

- [\_tag](loadConfig.LoadConfigError.md#_tag)
- [cause](loadConfig.LoadConfigError.md#cause)
- [message](loadConfig.LoadConfigError.md#message)
- [name](loadConfig.LoadConfigError.md#name)
- [stack](loadConfig.LoadConfigError.md#stack)
- [prepareStackTrace](loadConfig.LoadConfigError.md#preparestacktrace)
- [stackTraceLimit](loadConfig.LoadConfigError.md#stacktracelimit)

### Methods

- [captureStackTrace](loadConfig.LoadConfigError.md#capturestacktrace)

## Constructors

### constructor

• **new LoadConfigError**(`configFilePath`, `underlyingError`): [`LoadConfigError`](loadConfig.LoadConfigError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `configFilePath` | `string` |
| `underlyingError` | [`LoadConfigErrorType`](../modules/loadConfig.md#loadconfigerrortype) |

#### Returns

[`LoadConfigError`](loadConfig.LoadConfigError.md)

#### Overrides

Error.constructor

#### Defined in

[bundler/config/src/loadConfig.js:37](https://github.com/evmts/tevm-monorepo/blob/main/bundler/config/src/loadConfig.js#L37)

## Properties

### \_tag

• **\_tag**: ``"InvalidConfigError"`` \| ``"FoundryNotFoundError"`` \| ``"FoundryConfigError"`` \| ``"InvalidRemappingsError"`` \| ``"FailedToReadConfigError"`` \| ``"ParseJsonError"`` \| ``"NoPluginInTsConfigFoundError"``

#### Defined in

[bundler/config/src/loadConfig.js:32](https://github.com/evmts/tevm-monorepo/blob/main/bundler/config/src/loadConfig.js#L32)

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

• **name**: ``"InvalidConfigError"`` \| ``"FoundryNotFoundError"`` \| ``"FoundryConfigError"`` \| ``"InvalidRemappingsError"`` \| ``"FailedToReadConfigError"`` \| ``"ParseJsonError"`` \| ``"NoPluginInTsConfigFoundError"``

#### Overrides

Error.name

#### Defined in

[bundler/config/src/loadConfig.js:28](https://github.com/evmts/tevm-monorepo/blob/main/bundler/config/src/loadConfig.js#L28)

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
