[@tevm/errors](../README.md) / [Exports](../modules.md) / UnknownMethodError

# Class: UnknownMethodError

Error thrown when a request is made with an unknown method

## Hierarchy

- `Error`

  ↳ **`UnknownMethodError`**

## Table of contents

### Constructors

- [constructor](UnknownMethodError.md#constructor)

### Properties

- [\_tag](UnknownMethodError.md#_tag)
- [cause](UnknownMethodError.md#cause)
- [message](UnknownMethodError.md#message)
- [name](UnknownMethodError.md#name)
- [stack](UnknownMethodError.md#stack)
- [prepareStackTrace](UnknownMethodError.md#preparestacktrace)
- [stackTraceLimit](UnknownMethodError.md#stacktracelimit)

### Methods

- [captureStackTrace](UnknownMethodError.md#capturestacktrace)

## Constructors

### constructor

• **new UnknownMethodError**(`request`): [`UnknownMethodError`](UnknownMethodError.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | `never` | a request that must be of type `never` such that all valid requests are handled |

#### Returns

[`UnknownMethodError`](UnknownMethodError.md)

#### Overrides

Error.constructor

#### Defined in

[evmts-monorepo/packages/errors/src/procedures/UnknownMethodError.js:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/procedures/UnknownMethodError.js#L19)

## Properties

### \_tag

• **\_tag**: ``"UnknownMethodError"``

#### Defined in

[evmts-monorepo/packages/errors/src/procedures/UnknownMethodError.js:15](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/procedures/UnknownMethodError.js#L15)

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

[evmts-monorepo/packages/errors/src/procedures/UnknownMethodError.js:11](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/procedures/UnknownMethodError.js#L11)

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

evmts-monorepo/node_modules/.pnpm/bun-types@1.0.26/node_modules/bun-types/globals.d.ts:1532

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

evmts-monorepo/node_modules/.pnpm/@types+node@20.11.5/node_modules/@types/node/globals.d.ts:30

evmts-monorepo/node_modules/.pnpm/@types+node@20.11.19/node_modules/@types/node/globals.d.ts:30

evmts-monorepo/node_modules/.pnpm/bun-types@1.0.26/node_modules/bun-types/globals.d.ts:1534

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

evmts-monorepo/node_modules/.pnpm/bun-types@1.0.26/node_modules/bun-types/globals.d.ts:1525
