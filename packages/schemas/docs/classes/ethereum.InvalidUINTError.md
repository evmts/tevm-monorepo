[@evmts/schemas](../README.md) / [Modules](../modules.md) / [ethereum](../modules/ethereum.md) / InvalidUINTError

# Class: InvalidUINTError

[ethereum](../modules/ethereum.md).InvalidUINTError

Error thrown when a UINT256 is invalid.
A uintbigint is invalid if it is not a non-negative integer or overflows

## Hierarchy

- `TypeError`

  ↳ **`InvalidUINTError`**

## Table of contents

### Constructors

- [constructor](ethereum.InvalidUINTError.md#constructor)

### Properties

- [cause](ethereum.InvalidUINTError.md#cause)
- [message](ethereum.InvalidUINTError.md#message)
- [name](ethereum.InvalidUINTError.md#name)
- [stack](ethereum.InvalidUINTError.md#stack)
- [prepareStackTrace](ethereum.InvalidUINTError.md#preparestacktrace)
- [stackTraceLimit](ethereum.InvalidUINTError.md#stacktracelimit)

### Methods

- [captureStackTrace](ethereum.InvalidUINTError.md#capturestacktrace)

## Constructors

### constructor

• **new InvalidUINTError**(`options`): [`InvalidUINTError`](ethereum.InvalidUINTError.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | The options for the error. |
| `options.cause` | `undefined` \| readonly [`ParseErrors`, `ParseErrors`] | The cause of the error. |
| `options.docs` | `undefined` \| `string` | The documentation URL. |
| `options.message` | `undefined` \| `string` | The error message. |
| `options.size` | [`UINTSize`](../modules/ethereum.md#uintsize) | The size of the uint. |
| `options.uint` | `bigint` | The invalid uint256 bigint. |

#### Returns

[`InvalidUINTError`](ethereum.InvalidUINTError.md)

#### Overrides

TypeError.constructor

#### Defined in

[packages/schemas/src/ethereum/SUINT/Errors.js:28](https://github.com/evmts/evmts-monorepo/blob/main/packages/schemas/src/ethereum/SUINT/Errors.js#L28)

## Properties

### cause

• **cause**: `undefined` \| `string`

#### Inherited from

TypeError.cause

#### Defined in

[packages/schemas/src/ethereum/SUINT/Errors.js:38](https://github.com/evmts/evmts-monorepo/blob/main/packages/schemas/src/ethereum/SUINT/Errors.js#L38)

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

node_modules/.pnpm/@types+node@20.9.1/node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

TypeError.stackTraceLimit

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

TypeError.captureStackTrace

#### Defined in

node_modules/.pnpm/@types+node@20.9.1/node_modules/@types/node/globals.d.ts:4
