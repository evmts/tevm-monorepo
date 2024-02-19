[tevm](../README.md) / [Modules](../modules.md) / [errors](../modules/errors.md) / ProxyFetchError

# Class: ProxyFetchError

[errors](../modules/errors.md).ProxyFetchError

Error when there is a problem with the underlying forked provider
Potentially could be network issues

## Hierarchy

- `Error`

  ↳ **`ProxyFetchError`**

## Table of contents

### Constructors

- [constructor](errors.ProxyFetchError.md#constructor)

### Properties

- [\_tag](errors.ProxyFetchError.md#_tag)
- [cause](errors.ProxyFetchError.md#cause)
- [message](errors.ProxyFetchError.md#message)
- [name](errors.ProxyFetchError.md#name)
- [stack](errors.ProxyFetchError.md#stack)
- [prepareStackTrace](errors.ProxyFetchError.md#preparestacktrace)
- [stackTraceLimit](errors.ProxyFetchError.md#stacktracelimit)

### Methods

- [captureStackTrace](errors.ProxyFetchError.md#capturestacktrace)

## Constructors

### constructor

• **new ProxyFetchError**(`method`): [`ProxyFetchError`](errors.ProxyFetchError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | `string` |

#### Returns

[`ProxyFetchError`](errors.ProxyFetchError.md)

#### Overrides

Error.constructor

#### Defined in

evmts-monorepo/packages/errors/types/client/ProxyFetchError.d.ts:9

## Properties

### \_tag

• **\_tag**: ``"ProxyFetchError"``

#### Defined in

evmts-monorepo/packages/errors/types/client/ProxyFetchError.d.ts:18

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

• **name**: ``"ProxyFetchError"``

#### Overrides

Error.name

#### Defined in

evmts-monorepo/packages/errors/types/client/ProxyFetchError.d.ts:14

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
