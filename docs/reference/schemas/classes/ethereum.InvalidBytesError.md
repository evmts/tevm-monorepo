[@evmts/schemas](/reference/schema/README.md) / [Modules](/reference/schema/modules.md) / [ethereum](/reference/schema/modules/ethereum.md) / InvalidBytesError

# Class: InvalidBytesError

[ethereum](/reference/schema/modules/ethereum.md).InvalidBytesError

Error thrown when a FixedByte is invalid.
A FixedByte string is invalid if it's not within the bounds of its size.

## Hierarchy

- `TypeError`

  ↳ **`InvalidBytesError`**

## Table of contents

### Constructors

- [constructor](/reference/schema/classes/ethereum.InvalidBytesError.md#constructor)

### Properties

- [cause](/reference/schema/classes/ethereum.InvalidBytesError.md#cause)
- [message](/reference/schema/classes/ethereum.InvalidBytesError.md#message)
- [name](/reference/schema/classes/ethereum.InvalidBytesError.md#name)
- [stack](/reference/schema/classes/ethereum.InvalidBytesError.md#stack)
- [prepareStackTrace](/reference/schema/classes/ethereum.InvalidBytesError.md#preparestacktrace)
- [stackTraceLimit](/reference/schema/classes/ethereum.InvalidBytesError.md#stacktracelimit)

### Methods

- [captureStackTrace](/reference/schema/classes/ethereum.InvalidBytesError.md#capturestacktrace)

## Constructors

### constructor

• **new InvalidBytesError**(`options`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | The options for the error. |
| `options.bytes` | `string` | The invalid bytes string. |
| `options.cause` | `undefined` \| readonly [`ParseErrors`, `ParseErrors`] | The cause of the error. |
| `options.docs` | `undefined` \| `string` | The documentation URL. |
| `options.message` | `undefined` \| `string` | The error message. |
| `options.size` | [`BytesCapacity`](/reference/schema/modules/ethereum.md#bytescapacity) | The size of the bytes. |

#### Overrides

TypeError.constructor

#### Defined in

[schemas/src/ethereum/SBytesFixed/Errors.js:28](https://github.com/evmts/evmts-monorepo/blob/main/schemas/src/ethereum/SBytesFixed/Errors.js#L28)

## Properties

### cause

• **cause**: `undefined` \| `string`

#### Inherited from

TypeError.cause

#### Defined in

[schemas/src/ethereum/SBytesFixed/Errors.js:40](https://github.com/evmts/evmts-monorepo/blob/main/schemas/src/ethereum/SBytesFixed/Errors.js#L40)

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
