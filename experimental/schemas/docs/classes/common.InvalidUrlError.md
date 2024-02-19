[@tevm/schemas](../README.md) / [Modules](../modules.md) / [common](../modules/common.md) / InvalidUrlError

# Class: InvalidUrlError

[common](../modules/common.md).InvalidUrlError

Error thrown when an invalid Url is provided.

## Hierarchy

- `TypeError`

  ↳ **`InvalidUrlError`**

## Table of contents

### Constructors

- [constructor](common.InvalidUrlError.md#constructor)

### Properties

- [cause](common.InvalidUrlError.md#cause)
- [message](common.InvalidUrlError.md#message)
- [name](common.InvalidUrlError.md#name)
- [stack](common.InvalidUrlError.md#stack)
- [prepareStackTrace](common.InvalidUrlError.md#preparestacktrace)
- [stackTraceLimit](common.InvalidUrlError.md#stacktracelimit)

### Methods

- [captureStackTrace](common.InvalidUrlError.md#capturestacktrace)

## Constructors

### constructor

• **new InvalidUrlError**(`options?`): [`InvalidUrlError`](common.InvalidUrlError.md)

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `options` | `Object` | `{}` | The options for the error. |
| `options.cause` | `undefined` \| readonly [`ParseErrors`, `ParseErrors`] | `undefined` | The cause of the error. |
| `options.docs` | `undefined` \| `string` | `'https://tevm.sh/reference/errors'` | The documentation URL. |
| `options.message` | `undefined` \| `string` | `undefined` | The error message. |
| `options.url` | `unknown` | `undefined` | The invalid URL value. |

#### Returns

[`InvalidUrlError`](common.InvalidUrlError.md)

#### Overrides

TypeError.constructor

#### Defined in

[evmts-monorepo/experimental/schemas/src/common/SUrl.js:69](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/common/SUrl.js#L69)

## Properties

### cause

• **cause**: `undefined` \| `string`

#### Inherited from

TypeError.cause

#### Defined in

[evmts-monorepo/experimental/schemas/src/common/SUrl.js:76](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/common/SUrl.js#L76)

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
