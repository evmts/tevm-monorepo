[@evmts/schemas](../README.md) / [Exports](../modules.md) / InvalidUINTError

# Class: InvalidUINTError

Error thrown when a UINT256 is invalid.
A uintbigint is invalid if it is not a non-negative integer or overflows

## Hierarchy

- `TypeError`

  ↳ **`InvalidUINTError`**

## Table of contents

### Constructors

- [constructor](InvalidUINTError.md#constructor)

### Properties

- [cause](InvalidUINTError.md#cause)
- [message](InvalidUINTError.md#message)
- [name](InvalidUINTError.md#name)
- [stack](InvalidUINTError.md#stack)
- [prepareStackTrace](InvalidUINTError.md#preparestacktrace)
- [stackTraceLimit](InvalidUINTError.md#stacktracelimit)

### Methods

- [captureStackTrace](InvalidUINTError.md#capturestacktrace)

## Constructors

### constructor

• **new InvalidUINTError**(`options`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | The options for the error. |
| `options.cause` | `undefined` \| readonly [`ParseErrors`, `ParseErrors`] | The cause of the error. |
| `options.docs` | `undefined` \| `string` | The documentation URL. |
| `options.message` | `undefined` \| `string` | The error message. |
| `options.size` | [`UINTSize`](../modules.md#uintsize) | The size of the uint. |
| `options.uint` | `bigint` | The invalid uint256 bigint. |

#### Overrides

TypeError.constructor

#### Defined in

[schemas/src/SUINT.js:306](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SUINT.js#L306)

## Properties

### cause

• **cause**: `undefined` \| `string`

#### Inherited from

TypeError.cause

#### Defined in

[schemas/src/SUINT.js:316](https://github.com/evmts/evmts-monorepo/blob/fb5c4520/schemas/src/SUINT.js#L316)

___

### message

• **message**: `string`

#### Inherited from

TypeError.message

#### Defined in

node_modules/.pnpm/typescript@5.2.2/node_modules/typescript/lib/lib.es5.d.ts:1068

___

### name

• **name**: `string`

#### Inherited from

TypeError.name

#### Defined in

node_modules/.pnpm/typescript@5.2.2/node_modules/typescript/lib/lib.es5.d.ts:1067

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

TypeError.stack

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

TypeError.prepareStackTrace

#### Defined in

node_modules/.pnpm/@types+node@20.7.2/node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

TypeError.stackTraceLimit

#### Defined in

node_modules/.pnpm/@types+node@20.7.2/node_modules/@types/node/globals.d.ts:13

## Methods

### captureStackTrace

▸ `Static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

TypeError.captureStackTrace

#### Defined in

node_modules/.pnpm/@types+node@20.7.2/node_modules/@types/node/globals.d.ts:4
