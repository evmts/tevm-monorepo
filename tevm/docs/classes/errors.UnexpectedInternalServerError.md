[tevm](../README.md) / [Modules](../modules.md) / [errors](../modules/errors.md) / UnexpectedInternalServerError

# Class: UnexpectedInternalServerError

[errors](../modules/errors.md).UnexpectedInternalServerError

Error that is thrown when something unexpected happens
THis error being thrown indicates a bug or unhandled error
internally in tevm and thus shouldn't happen often

## Hierarchy

- `Error`

  ↳ **`UnexpectedInternalServerError`**

## Table of contents

### Constructors

- [constructor](errors.UnexpectedInternalServerError.md#constructor)

### Properties

- [\_tag](errors.UnexpectedInternalServerError.md#_tag)
- [cause](errors.UnexpectedInternalServerError.md#cause)
- [message](errors.UnexpectedInternalServerError.md#message)
- [name](errors.UnexpectedInternalServerError.md#name)
- [stack](errors.UnexpectedInternalServerError.md#stack)
- [prepareStackTrace](errors.UnexpectedInternalServerError.md#preparestacktrace)
- [stackTraceLimit](errors.UnexpectedInternalServerError.md#stacktracelimit)

### Methods

- [captureStackTrace](errors.UnexpectedInternalServerError.md#capturestacktrace)

## Constructors

### constructor

• **new UnexpectedInternalServerError**(`method`): [`UnexpectedInternalServerError`](errors.UnexpectedInternalServerError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | `string` |

#### Returns

[`UnexpectedInternalServerError`](errors.UnexpectedInternalServerError.md)

#### Overrides

Error.constructor

#### Defined in

evmts-monorepo/packages/errors/types/client/UnexpectedInternalServerError.d.ts:10

## Properties

### \_tag

• **\_tag**: ``"UnexpectedInternalServerError"``

#### Defined in

evmts-monorepo/packages/errors/types/client/UnexpectedInternalServerError.d.ts:19

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

• **name**: ``"UnexpectedInternalServerError"``

#### Overrides

Error.name

#### Defined in

evmts-monorepo/packages/errors/types/client/UnexpectedInternalServerError.d.ts:15

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
