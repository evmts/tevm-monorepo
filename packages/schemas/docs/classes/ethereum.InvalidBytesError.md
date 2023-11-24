[@evmts/schemas](../README.md) / [Modules](../modules.md) / [ethereum](../modules/ethereum.md) / InvalidBytesError

# Class: InvalidBytesError

[ethereum](../modules/ethereum.md).InvalidBytesError

Error thrown when an invalid Bytes is provided.

## Hierarchy

- `TypeError`

  ↳ **`InvalidBytesError`**

## Table of contents

### Constructors

- [constructor](ethereum.InvalidBytesError.md#constructor)

### Properties

- [cause](ethereum.InvalidBytesError.md#cause)
- [message](ethereum.InvalidBytesError.md#message)
- [name](ethereum.InvalidBytesError.md#name)
- [stack](ethereum.InvalidBytesError.md#stack)
- [prepareStackTrace](ethereum.InvalidBytesError.md#preparestacktrace)
- [stackTraceLimit](ethereum.InvalidBytesError.md#stacktracelimit)

### Methods

- [captureStackTrace](ethereum.InvalidBytesError.md#capturestacktrace)

## Constructors

### constructor

• **new InvalidBytesError**(`options?`): [`InvalidBytesError`](ethereum.InvalidBytesError.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | The options for the error. |
| `options.cause` | `undefined` \| readonly [`ParseErrors`, `ParseErrors`] | The cause of the error. |
| `options.docs` | `undefined` \| `string` | The documentation URL. |
| `options.message` | `undefined` \| `string` | The error message. |
| `options.value` | `unknown` | The invalid hex value. |

#### Returns

[`InvalidBytesError`](ethereum.InvalidBytesError.md)

#### Overrides

TypeError.constructor

#### Defined in

[packages/schemas/src/ethereum/SBytes/Errors.js:19](https://github.com/evmts/evmts-monorepo/blob/main/packages/schemas/src/ethereum/SBytes/Errors.js#L19)

## Properties

### cause

• **cause**: `undefined` \| `string`

#### Inherited from

TypeError.cause

#### Defined in

[packages/schemas/src/ethereum/SBytes/Errors.js:26](https://github.com/evmts/evmts-monorepo/blob/main/packages/schemas/src/ethereum/SBytes/Errors.js#L26)

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
