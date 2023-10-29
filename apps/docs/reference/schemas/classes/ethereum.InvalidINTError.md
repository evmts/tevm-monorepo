[@evmts/schemas](/reference/schemas/README.md) / [Modules](/reference/schemas/modules.md) / [ethereum](/reference/schemas/modules/ethereum.md) / InvalidINTError

# Class: InvalidINTError

[ethereum](/reference/schemas/modules/ethereum.md).InvalidINTError

Error thrown when an INT is invalid.
An int bigint is invalid if it's not within the bounds of its size.

## Hierarchy

- `TypeError`

  ↳ **`InvalidINTError`**

## Table of contents

### Constructors

- [constructor](/reference/schemas/classes/ethereum.InvalidINTError.md#constructor)

### Properties

- [cause](/reference/schemas/classes/ethereum.InvalidINTError.md#cause)
- [message](/reference/schemas/classes/ethereum.InvalidINTError.md#message)
- [name](/reference/schemas/classes/ethereum.InvalidINTError.md#name)
- [stack](/reference/schemas/classes/ethereum.InvalidINTError.md#stack)
- [prepareStackTrace](/reference/schemas/classes/ethereum.InvalidINTError.md#preparestacktrace)
- [stackTraceLimit](/reference/schemas/classes/ethereum.InvalidINTError.md#stacktracelimit)

### Methods

- [captureStackTrace](/reference/schemas/classes/ethereum.InvalidINTError.md#capturestacktrace)

## Constructors

### constructor

• **new InvalidINTError**(`options`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | The options for the error. |
| `options.cause` | `undefined` \| readonly [`ParseErrors`, `ParseErrors`] | The cause of the error. |
| `options.docs` | `undefined` \| `string` | The documentation URL. |
| `options.int` | `bigint` | The invalid int bigint. |
| `options.message` | `undefined` \| `string` | The error message. |
| `options.size` | [`INTSize`](/reference/schemas/modules/ethereum.md#intsize) | The size of the int. |

#### Overrides

TypeError.constructor

#### Defined in

[schemas/src/ethereum/SINT/Errors.js:28](https://github.com/evmts/evmts-monorepo/blob/main/schemas/src/ethereum/SINT/Errors.js#L28)

## Properties

### cause

• **cause**: `undefined` \| `string`

#### Inherited from

TypeError.cause

#### Defined in

[schemas/src/ethereum/SINT/Errors.js:48](https://github.com/evmts/evmts-monorepo/blob/main/schemas/src/ethereum/SINT/Errors.js#L48)

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
