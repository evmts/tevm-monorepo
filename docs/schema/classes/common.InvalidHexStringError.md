[@evmts/schemas](/schema/README.md) / [Modules](/schema/modules.md) / [common](/schema/modules/common.md) / InvalidHexStringError

# Class: InvalidHexStringError

[common](/schema/modules/common.md).InvalidHexStringError

Error thrown when an invalid HexString is provided.

## Hierarchy

- `TypeError`

  ↳ **`InvalidHexStringError`**

## Table of contents

### Constructors

- [constructor](/schema/classes/common.InvalidHexStringError.md#constructor)

### Properties

- [cause](/schema/classes/common.InvalidHexStringError.md#cause)
- [message](/schema/classes/common.InvalidHexStringError.md#message)
- [name](/schema/classes/common.InvalidHexStringError.md#name)
- [stack](/schema/classes/common.InvalidHexStringError.md#stack)
- [prepareStackTrace](/schema/classes/common.InvalidHexStringError.md#preparestacktrace)
- [stackTraceLimit](/schema/classes/common.InvalidHexStringError.md#stacktracelimit)

### Methods

- [captureStackTrace](/schema/classes/common.InvalidHexStringError.md#capturestacktrace)

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

[schemas/src/common/SHexString.js:58](https://github.com/evmts/evmts-monorepo/blob/main/schemas/src/common/SHexString.js#L58)

## Properties

### cause

• **cause**: `undefined` \| `string`

#### Inherited from

TypeError.cause

#### Defined in

[schemas/src/common/SHexString.js:65](https://github.com/evmts/evmts-monorepo/blob/main/schemas/src/common/SHexString.js#L65)

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
