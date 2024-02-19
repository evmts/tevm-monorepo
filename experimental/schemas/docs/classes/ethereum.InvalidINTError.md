[@tevm/schemas](../README.md) / [Modules](../modules.md) / [ethereum](../modules/ethereum.md) / InvalidINTError

# Class: InvalidINTError

[ethereum](../modules/ethereum.md).InvalidINTError

Error thrown when an INT is invalid.
An int bigint is invalid if it's not within the bounds of its size.

## Hierarchy

- `TypeError`

  ↳ **`InvalidINTError`**

## Table of contents

### Constructors

- [constructor](ethereum.InvalidINTError.md#constructor)

### Properties

- [cause](ethereum.InvalidINTError.md#cause)
- [message](ethereum.InvalidINTError.md#message)
- [name](ethereum.InvalidINTError.md#name)
- [stack](ethereum.InvalidINTError.md#stack)
- [prepareStackTrace](ethereum.InvalidINTError.md#preparestacktrace)
- [stackTraceLimit](ethereum.InvalidINTError.md#stacktracelimit)

### Methods

- [captureStackTrace](ethereum.InvalidINTError.md#capturestacktrace)

## Constructors

### constructor

• **new InvalidINTError**(`options`): [`InvalidINTError`](ethereum.InvalidINTError.md)

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `options` | `Object` | `undefined` | The options for the error. |
| `options.cause` | `undefined` \| readonly [`ParseErrors`, `ParseErrors`] | `undefined` | The cause of the error. |
| `options.docs` | `undefined` \| `string` | `'https://tevm.sh/reference/errors'` | The documentation URL. |
| `options.int` | `bigint` | `undefined` | The invalid int bigint. |
| `options.message` | `undefined` \| `string` | `undefined` | The error message. |
| `options.size` | [`INTSize`](../modules/ethereum.md#intsize) | `undefined` | The size of the int. |

#### Returns

[`InvalidINTError`](ethereum.InvalidINTError.md)

#### Overrides

TypeError.constructor

#### Defined in

[evmts-monorepo/experimental/schemas/src/ethereum/SINT/Errors.js:28](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SINT/Errors.js#L28)

## Properties

### cause

• **cause**: `undefined` \| `string`

#### Inherited from

TypeError.cause

#### Defined in

[evmts-monorepo/experimental/schemas/src/ethereum/SINT/Errors.js:48](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SINT/Errors.js#L48)

___

### message

• **message**: `string`

#### Inherited from

TypeError.message

#### Defined in

.nvm/versions/node/v20.9.0/lib/node_modules/typescript/lib/lib.es5.d.ts:1076

___

### name

• **name**: `string`

#### Inherited from

TypeError.name

#### Defined in

.nvm/versions/node/v20.9.0/lib/node_modules/typescript/lib/lib.es5.d.ts:1075

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

TypeError.stack

#### Defined in

.nvm/versions/node/v20.9.0/lib/node_modules/typescript/lib/lib.es5.d.ts:1077

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

Optional override for formatting stack traces

**`See`**

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

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

evmts-monorepo/node_modules/.pnpm/@types+node@20.11.5/node_modules/@types/node/globals.d.ts:28

evmts-monorepo/node_modules/.pnpm/@types+node@20.11.19/node_modules/@types/node/globals.d.ts:28

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

TypeError.stackTraceLimit

#### Defined in

evmts-monorepo/node_modules/.pnpm/@types+node@20.11.5/node_modules/@types/node/globals.d.ts:30

evmts-monorepo/node_modules/.pnpm/@types+node@20.11.19/node_modules/@types/node/globals.d.ts:30

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

evmts-monorepo/node_modules/.pnpm/@types+node@20.11.5/node_modules/@types/node/globals.d.ts:21

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

evmts-monorepo/node_modules/.pnpm/@types+node@20.11.19/node_modules/@types/node/globals.d.ts:21
