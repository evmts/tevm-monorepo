[tevm](../README.md) / [Modules](../modules.md) / [errors](../modules/errors.md) / UnsupportedMethodError

# Class: UnsupportedMethodError

[errors](../modules/errors.md).UnsupportedMethodError

Error when a given JSON-RPC method is not supported

## Hierarchy

- `Error`

  ↳ **`UnsupportedMethodError`**

## Table of contents

### Constructors

- [constructor](errors.UnsupportedMethodError.md#constructor)

### Properties

- [\_tag](errors.UnsupportedMethodError.md#_tag)
- [cause](errors.UnsupportedMethodError.md#cause)
- [message](errors.UnsupportedMethodError.md#message)
- [name](errors.UnsupportedMethodError.md#name)
- [stack](errors.UnsupportedMethodError.md#stack)
- [prepareStackTrace](errors.UnsupportedMethodError.md#preparestacktrace)
- [stackTraceLimit](errors.UnsupportedMethodError.md#stacktracelimit)

### Methods

- [captureStackTrace](errors.UnsupportedMethodError.md#capturestacktrace)

## Constructors

### constructor

• **new UnsupportedMethodError**(`method`): [`UnsupportedMethodError`](errors.UnsupportedMethodError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | `string` |

#### Returns

[`UnsupportedMethodError`](errors.UnsupportedMethodError.md)

#### Overrides

Error.constructor

#### Defined in

evmts-monorepo/packages/errors/types/client/UnsupportedMethodError.d.ts:8

## Properties

### \_tag

• **\_tag**: ``"UnsupportedMethodError"``

#### Defined in

evmts-monorepo/packages/errors/types/client/UnsupportedMethodError.d.ts:17

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

• **name**: ``"UnsupportedMethodError"``

#### Overrides

Error.name

#### Defined in

evmts-monorepo/packages/errors/types/client/UnsupportedMethodError.d.ts:13

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
