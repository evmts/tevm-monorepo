[tevm](../README.md) / [Modules](../modules.md) / [errors](../modules/errors.md) / NoProxyConfiguredError

# Class: NoProxyConfiguredError

[errors](../modules/errors.md).NoProxyConfiguredError

Error thrown when a action or request cannot be fulfilled
without a proxy url being configured

## Hierarchy

- `Error`

  ↳ **`NoProxyConfiguredError`**

## Table of contents

### Constructors

- [constructor](errors.NoProxyConfiguredError.md#constructor)

### Properties

- [\_tag](errors.NoProxyConfiguredError.md#_tag)
- [cause](errors.NoProxyConfiguredError.md#cause)
- [message](errors.NoProxyConfiguredError.md#message)
- [name](errors.NoProxyConfiguredError.md#name)
- [stack](errors.NoProxyConfiguredError.md#stack)
- [prepareStackTrace](errors.NoProxyConfiguredError.md#preparestacktrace)
- [stackTraceLimit](errors.NoProxyConfiguredError.md#stacktracelimit)

### Methods

- [captureStackTrace](errors.NoProxyConfiguredError.md#capturestacktrace)

## Constructors

### constructor

• **new NoProxyConfiguredError**(`method`): [`NoProxyConfiguredError`](errors.NoProxyConfiguredError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | `string` |

#### Returns

[`NoProxyConfiguredError`](errors.NoProxyConfiguredError.md)

#### Overrides

Error.constructor

#### Defined in

evmts-monorepo/packages/errors/types/client/NoProxyConfiguredError.d.ts:9

## Properties

### \_tag

• **\_tag**: ``"NoProxyConfiguredError"``

#### Defined in

evmts-monorepo/packages/errors/types/client/NoProxyConfiguredError.d.ts:18

___

### cause

• `Optional` **cause**: `unknown`

#### Inherited from

Error.cause

#### Defined in

.nvm/versions/node/v20.9.0/lib/node_modules/typescript/lib/lib.es2022.error.d.ts:24

___

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

.nvm/versions/node/v20.9.0/lib/node_modules/typescript/lib/lib.es5.d.ts:1076

___

### name

• **name**: ``"NoProxyConfiguredError"``

#### Overrides

Error.name

#### Defined in

evmts-monorepo/packages/errors/types/client/NoProxyConfiguredError.d.ts:14

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

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

Error.prepareStackTrace

#### Defined in

evmts-monorepo/node_modules/.pnpm/@types+node@20.11.5/node_modules/@types/node/globals.d.ts:28

evmts-monorepo/node_modules/.pnpm/@types+node@20.11.19/node_modules/@types/node/globals.d.ts:28

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

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

Error.captureStackTrace

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

Error.captureStackTrace

#### Defined in

evmts-monorepo/node_modules/.pnpm/@types+node@20.11.19/node_modules/@types/node/globals.d.ts:21
