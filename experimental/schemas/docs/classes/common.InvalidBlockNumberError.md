[@tevm/schemas](../README.md) / [Modules](../modules.md) / [common](../modules/common.md) / InvalidBlockNumberError

# Class: InvalidBlockNumberError

[common](../modules/common.md).InvalidBlockNumberError

Error thrown when a BlockNumber is invalid.
A block number is invalid if it is not a non-negative integer.

## Hierarchy

- `TypeError`

  ↳ **`InvalidBlockNumberError`**

## Table of contents

### Constructors

- [constructor](common.InvalidBlockNumberError.md#constructor)

### Properties

- [cause](common.InvalidBlockNumberError.md#cause)
- [message](common.InvalidBlockNumberError.md#message)
- [name](common.InvalidBlockNumberError.md#name)
- [stack](common.InvalidBlockNumberError.md#stack)
- [prepareStackTrace](common.InvalidBlockNumberError.md#preparestacktrace)
- [stackTraceLimit](common.InvalidBlockNumberError.md#stacktracelimit)

### Methods

- [captureStackTrace](common.InvalidBlockNumberError.md#capturestacktrace)

## Constructors

### constructor

• **new InvalidBlockNumberError**(`options?`): [`InvalidBlockNumberError`](common.InvalidBlockNumberError.md)

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `options` | `Object` | `{}` | The options for the error. |
| `options.blockNumber` | `unknown` | `undefined` | The invalid block number. |
| `options.cause` | `undefined` \| readonly [`ParseErrors`, `ParseErrors`] | `undefined` | The cause of the error. |
| `options.docs` | `undefined` \| `string` | `'https://tevm.sh/reference/errors'` | The documentation URL. |
| `options.message` | `undefined` \| `string` | `undefined` | The error message. |

#### Returns

[`InvalidBlockNumberError`](common.InvalidBlockNumberError.md)

#### Overrides

TypeError.constructor

#### Defined in

[evmts-monorepo/experimental/schemas/src/common/SBlockNumber.js:62](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/common/SBlockNumber.js#L62)

## Properties

### cause

• **cause**: `undefined` \| `string`

#### Inherited from

TypeError.cause

#### Defined in

[evmts-monorepo/experimental/schemas/src/common/SBlockNumber.js:69](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/common/SBlockNumber.js#L69)

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
