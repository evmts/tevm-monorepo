[@evmts/schemas](/reference/schemas/README.md) / [Modules](/reference/schemas/modules.md) / [ethereum](/reference/schemas/modules/ethereum.md) / InvalidUINTError

# Class: InvalidUINTError

[ethereum](/reference/schemas/modules/ethereum.md).InvalidUINTError

Error thrown when a UINT256 is invalid.
A uintbigint is invalid if it is not a non-negative integer or overflows

## Hierarchy

- `TypeError`

  ↳ **`InvalidUINTError`**

## Table of contents

### Constructors

- [constructor](/reference/schemas/classes/ethereum.InvalidUINTError.md#constructor)

### Properties

- [cause](/reference/schemas/classes/ethereum.InvalidUINTError.md#cause)
- [message](/reference/schemas/classes/ethereum.InvalidUINTError.md#message)
- [name](/reference/schemas/classes/ethereum.InvalidUINTError.md#name)
- [stack](/reference/schemas/classes/ethereum.InvalidUINTError.md#stack)
- [prepareStackTrace](/reference/schemas/classes/ethereum.InvalidUINTError.md#preparestacktrace)
- [stackTraceLimit](/reference/schemas/classes/ethereum.InvalidUINTError.md#stacktracelimit)

### Methods

- [captureStackTrace](/reference/schemas/classes/ethereum.InvalidUINTError.md#capturestacktrace)

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
| `options.size` | [`UINTSize`](/reference/schemas/modules/ethereum.md#uintsize) | The size of the uint. |
| `options.uint` | `bigint` | The invalid uint256 bigint. |

#### Overrides

TypeError.constructor

#### Defined in

[schemas/src/ethereum/SUINT/Errors.js:28](https://github.com/evmts/evmts-monorepo/blob/main/schemas/src/ethereum/SUINT/Errors.js#L28)

## Properties

### cause

• **cause**: `undefined` \| `string`

#### Inherited from

TypeError.cause

#### Defined in

[schemas/src/ethereum/SUINT/Errors.js:38](https://github.com/evmts/evmts-monorepo/blob/main/schemas/src/ethereum/SUINT/Errors.js#L38)

___

### message

• **message**: `string`

#### Inherited from

TypeError.message

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1068

___

### name

• **name**: `string`

#### Inherited from

TypeError.name

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1067

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

TypeError.stack

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1069

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

node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

TypeError.stackTraceLimit

#### Defined in

node_modules/@types/node/globals.d.ts:13

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

node_modules/@types/node/globals.d.ts:4
