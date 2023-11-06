[Documentation](../README.md) / [@evmts/schemas](../modules/evmts_schemas.md) / [common](../modules/evmts_schemas.common.md) / InvalidBlockNumberError

# Class: InvalidBlockNumberError

[@evmts/schemas](../modules/evmts_schemas.md).[common](../modules/evmts_schemas.common.md).InvalidBlockNumberError

Error thrown when a BlockNumber is invalid.
A block number is invalid if it is not a non-negative integer.

## Hierarchy

- `TypeError`

  ↳ **`InvalidBlockNumberError`**

## Table of contents

### Constructors

- [constructor](evmts_schemas.common.InvalidBlockNumberError.md#constructor)

### Properties

- [cause](evmts_schemas.common.InvalidBlockNumberError.md#cause)
- [message](evmts_schemas.common.InvalidBlockNumberError.md#message)
- [name](evmts_schemas.common.InvalidBlockNumberError.md#name)
- [stack](evmts_schemas.common.InvalidBlockNumberError.md#stack)
- [prepareStackTrace](evmts_schemas.common.InvalidBlockNumberError.md#preparestacktrace)
- [stackTraceLimit](evmts_schemas.common.InvalidBlockNumberError.md#stacktracelimit)

### Methods

- [captureStackTrace](evmts_schemas.common.InvalidBlockNumberError.md#capturestacktrace)

## Constructors

### constructor

• **new InvalidBlockNumberError**(`options?`): [`InvalidBlockNumberError`](evmts_schemas.common.InvalidBlockNumberError.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | The options for the error. |
| `options.blockNumber` | `unknown` | The invalid block number. |
| `options.cause` | `undefined` \| readonly [`ParseErrors`, `ParseErrors`] | The cause of the error. |
| `options.docs` | `undefined` \| `string` | The documentation URL. |
| `options.message` | `undefined` \| `string` | The error message. |

#### Returns

[`InvalidBlockNumberError`](evmts_schemas.common.InvalidBlockNumberError.md)

#### Overrides

TypeError.constructor

#### Defined in

[packages/schemas/src/common/SBlockNumber.js:62](https://github.com/evmts/evmts-monorepo/blob/main/packages/schemas/src/common/SBlockNumber.js#L62)

## Properties

### cause

• **cause**: `undefined` \| `string`

#### Inherited from

TypeError.cause

#### Defined in

[packages/schemas/src/common/SBlockNumber.js:69](https://github.com/evmts/evmts-monorepo/blob/main/packages/schemas/src/common/SBlockNumber.js#L69)

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

node_modules/@types/node/globals.d.ts:4
