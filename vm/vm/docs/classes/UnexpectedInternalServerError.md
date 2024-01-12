[@tevm/vm](../README.md) / [Exports](../modules.md) / UnexpectedInternalServerError

# Class: UnexpectedInternalServerError

## Hierarchy

- `Error`

  ↳ **`UnexpectedInternalServerError`**

## Table of contents

### Constructors

- [constructor](UnexpectedInternalServerError.md#constructor)

### Properties

- [\_tag](UnexpectedInternalServerError.md#_tag)
- [cause](UnexpectedInternalServerError.md#cause)
- [message](UnexpectedInternalServerError.md#message)
- [name](UnexpectedInternalServerError.md#name)
- [stack](UnexpectedInternalServerError.md#stack)
- [prepareStackTrace](UnexpectedInternalServerError.md#preparestacktrace)
- [stackTraceLimit](UnexpectedInternalServerError.md#stacktracelimit)

### Methods

- [captureStackTrace](UnexpectedInternalServerError.md#capturestacktrace)

## Constructors

### constructor

• **new UnexpectedInternalServerError**(`method`): [`UnexpectedInternalServerError`](UnexpectedInternalServerError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | `string` |

#### Returns

[`UnexpectedInternalServerError`](UnexpectedInternalServerError.md)

#### Overrides

Error.constructor

#### Defined in

[vm/vm/src/errors/UnexpectedInternalServerError.js:14](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/errors/UnexpectedInternalServerError.js#L14)

## Properties

### \_tag

• **\_tag**: ``"UnexpectedInternalServerError"``

#### Defined in

[vm/vm/src/errors/UnexpectedInternalServerError.js:10](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/errors/UnexpectedInternalServerError.js#L10)

___

### cause

• `Optional` **cause**: `unknown`

#### Inherited from

Error.cause

#### Defined in

node_modules/.pnpm/typescript@5.3.3/node_modules/typescript/lib/lib.es2022.error.d.ts:24

___

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

node_modules/.pnpm/typescript@5.3.3/node_modules/typescript/lib/lib.es5.d.ts:1076

___

### name

• **name**: ``"UnexpectedInternalServerError"``

#### Overrides

Error.name

#### Defined in

[vm/vm/src/errors/UnexpectedInternalServerError.js:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/errors/UnexpectedInternalServerError.js#L6)

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

node_modules/.pnpm/typescript@5.3.3/node_modules/typescript/lib/lib.es5.d.ts:1077

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

node_modules/.pnpm/bun-types@1.0.21/node_modules/bun-types/types.d.ts:2235

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

node_modules/.pnpm/@types+node@20.9.1/node_modules/@types/node/globals.d.ts:13

node_modules/.pnpm/bun-types@1.0.21/node_modules/bun-types/types.d.ts:2239

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

node_modules/.pnpm/bun-types@1.0.21/node_modules/bun-types/types.d.ts:2228
