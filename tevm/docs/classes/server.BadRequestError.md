[tevm](../README.md) / [Modules](../modules.md) / [server](../modules/server.md) / BadRequestError

# Class: BadRequestError

[server](../modules/server.md).BadRequestError

Error thrown when request is malformed

## Hierarchy

- `Error`

  ↳ **`BadRequestError`**

## Table of contents

### Constructors

- [constructor](server.BadRequestError.md#constructor)

### Properties

- [\_tag](server.BadRequestError.md#_tag)
- [cause](server.BadRequestError.md#cause)
- [message](server.BadRequestError.md#message)
- [name](server.BadRequestError.md#name)
- [stack](server.BadRequestError.md#stack)
- [prepareStackTrace](server.BadRequestError.md#preparestacktrace)
- [stackTraceLimit](server.BadRequestError.md#stacktracelimit)

### Methods

- [captureStackTrace](server.BadRequestError.md#capturestacktrace)

## Constructors

### constructor

• **new BadRequestError**(`message?`): [`BadRequestError`](server.BadRequestError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

#### Returns

[`BadRequestError`](server.BadRequestError.md)

#### Inherited from

Error.constructor

#### Defined in

.nvm/versions/node/v20.9.0/lib/node_modules/typescript/lib/lib.es5.d.ts:1081

• **new BadRequestError**(`message?`, `options?`): [`BadRequestError`](server.BadRequestError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |
| `options?` | `ErrorOptions` |

#### Returns

[`BadRequestError`](server.BadRequestError.md)

#### Inherited from

Error.constructor

#### Defined in

.nvm/versions/node/v20.9.0/lib/node_modules/typescript/lib/lib.es5.d.ts:1081

## Properties

### \_tag

• **\_tag**: ``"BadRequestError"``

#### Defined in

evmts-monorepo/packages/server/types/BadRequestError.d.ts:13

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

• **name**: ``"BadRequestError"``

#### Overrides

Error.name

#### Defined in

evmts-monorepo/packages/server/types/BadRequestError.d.ts:9

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
