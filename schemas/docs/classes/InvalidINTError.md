[@evmts/schemas](../README.md) / [Exports](../modules.md) / InvalidINTError

# Class: InvalidINTError

Error thrown when an INT is invalid.
An int bigint is invalid if it's not within the bounds of its size.

## Hierarchy

- `TypeError`

  ↳ **`InvalidINTError`**

## Table of contents

### Constructors

- [constructor](InvalidINTError.md#constructor)

### Properties

- [cause](InvalidINTError.md#cause)
- [message](InvalidINTError.md#message)
- [name](InvalidINTError.md#name)
- [stack](InvalidINTError.md#stack)
- [prepareStackTrace](InvalidINTError.md#preparestacktrace)
- [stackTraceLimit](InvalidINTError.md#stacktracelimit)

### Methods

- [captureStackTrace](InvalidINTError.md#capturestacktrace)

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
| `options.size` | [`INTSize`](../modules.md#intsize) | The size of the int. |

#### Overrides

TypeError.constructor

#### Defined in

[schemas/src/ethereum/SINT/Errors.js:28](https://github.com/evmts/evmts-monorepo/blob/2bc5b05f/schemas/src/ethereum/SINT/Errors.js#L28)

## Properties

### cause

• **cause**: `undefined` \| `string`

#### Inherited from

TypeError.cause

#### Defined in

[schemas/src/ethereum/SINT/Errors.js:48](https://github.com/evmts/evmts-monorepo/blob/2bc5b05f/schemas/src/ethereum/SINT/Errors.js#L48)

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
