[tevm](../README.md) / [Modules](../modules.md) / [errors](../modules/errors.md) / UnknownMethodError

# Class: UnknownMethodError

[errors](../modules/errors.md).UnknownMethodError

Error thrown when a request is made with an unknown method

## Hierarchy

- `Error`

  ↳ **`UnknownMethodError`**

## Table of contents

### Constructors

- [constructor](errors.UnknownMethodError.md#constructor)

### Properties

- [\_tag](errors.UnknownMethodError.md#_tag)
- [cause](errors.UnknownMethodError.md#cause)
- [message](errors.UnknownMethodError.md#message)
- [name](errors.UnknownMethodError.md#name)
- [stack](errors.UnknownMethodError.md#stack)
- [prepareStackTrace](errors.UnknownMethodError.md#preparestacktrace)
- [stackTraceLimit](errors.UnknownMethodError.md#stacktracelimit)

### Methods

- [captureStackTrace](errors.UnknownMethodError.md#capturestacktrace)

## Constructors

### constructor

• **new UnknownMethodError**(`request`): [`UnknownMethodError`](errors.UnknownMethodError.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | `never` | a request that must be of type `never` such that all valid requests are handled |

#### Returns

[`UnknownMethodError`](errors.UnknownMethodError.md)

#### Overrides

Error.constructor

#### Defined in

evmts-monorepo/packages/errors/types/procedures/UnknownMethodError.d.ts:8

## Properties

### \_tag

• **\_tag**: ``"UnknownMethodError"``

#### Defined in

evmts-monorepo/packages/errors/types/procedures/UnknownMethodError.d.ts:17

___

### cause

• `Optional` **cause**: `unknown`

#### Inherited from

Error.cause

#### Defined in

.nvm/versions/node/v20.9.0/lib/node_modules/typescript/lib/lib.es2022.error.d.ts:24

___

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

.nvm/versions/node/v20.9.0/lib/node_modules/typescript/lib/lib.es5.d.ts:1076

___

### name

• **name**: ``"UnknownMethodError"``

#### Overrides

Error.name

#### Defined in

evmts-monorepo/packages/errors/types/procedures/UnknownMethodError.d.ts:13

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

.nvm/versions/node/v20.9.0/lib/node_modules/typescript/lib/lib.es5.d.ts:1077

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

Optional override for formatting stack traces

**`See`**

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

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

evmts-monorepo/node_modules/.pnpm/@types+node@20.11.5/node_modules/@types/node/globals.d.ts:28

evmts-monorepo/node_modules/.pnpm/@types+node@20.11.19/node_modules/@types/node/globals.d.ts:28

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

evmts-monorepo/node_modules/.pnpm/@types+node@20.11.5/node_modules/@types/node/globals.d.ts:30

evmts-monorepo/node_modules/.pnpm/@types+node@20.11.19/node_modules/@types/node/globals.d.ts:30

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

evmts-monorepo/node_modules/.pnpm/@types+node@20.11.5/node_modules/@types/node/globals.d.ts:21

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

evmts-monorepo/node_modules/.pnpm/@types+node@20.11.19/node_modules/@types/node/globals.d.ts:21
