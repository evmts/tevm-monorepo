[@evmts/schemas](../README.md) / [Modules](../modules.md) / [common](../modules/common.md) / InvalidHexStringError

# Class: InvalidHexStringError

[common](../modules/common.md).InvalidHexStringError

Error thrown when an invalid HexString is provided.

## Hierarchy

- `TypeError`

  ↳ **`InvalidHexStringError`**

## Table of contents

### Constructors

- [constructor](common.InvalidHexStringError.md#constructor)

### Properties

- [cause](common.InvalidHexStringError.md#cause)
- [message](common.InvalidHexStringError.md#message)
- [name](common.InvalidHexStringError.md#name)
- [stack](common.InvalidHexStringError.md#stack)
- [prepareStackTrace](common.InvalidHexStringError.md#preparestacktrace)
- [stackTraceLimit](common.InvalidHexStringError.md#stacktracelimit)

### Methods

- [captureStackTrace](common.InvalidHexStringError.md#capturestacktrace)

## Constructors

### constructor

• **new InvalidHexStringError**(`options?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | The options for the error. |
| `options.cause` | `undefined` \| readonly [`ParseErrors`, `ParseErrors`] | The cause of the error. |
| `options.docs` | `undefined` \| `string` | The documentation URL. |
| `options.message` | `undefined` \| `string` | The error message. |
| `options.value` | `unknown` | The invalid hex value. |

#### Overrides

TypeError.constructor

#### Defined in

schemas/src/common/SHexString.js:58

## Properties

### cause

• **cause**: `undefined` \| `string`

#### Inherited from

TypeError.cause

#### Defined in

schemas/src/common/SHexString.js:65

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
