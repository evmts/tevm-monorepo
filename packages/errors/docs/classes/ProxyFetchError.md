[@tevm/errors](../README.md) / [Exports](../modules.md) / ProxyFetchError

# Class: ProxyFetchError

Error when there is a problem with the underlying forked provider
Potentially could be network issues

## Hierarchy

- `Error`

  ↳ **`ProxyFetchError`**

## Table of contents

### Constructors

- [constructor](ProxyFetchError.md#constructor)

### Properties

- [\_tag](ProxyFetchError.md#_tag)
- [cause](ProxyFetchError.md#cause)
- [message](ProxyFetchError.md#message)
- [name](ProxyFetchError.md#name)
- [stack](ProxyFetchError.md#stack)
- [prepareStackTrace](ProxyFetchError.md#preparestacktrace)
- [stackTraceLimit](ProxyFetchError.md#stacktracelimit)

### Methods

- [captureStackTrace](ProxyFetchError.md#capturestacktrace)

## Constructors

### constructor

• **new ProxyFetchError**(`method`): [`ProxyFetchError`](ProxyFetchError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | `string` |

#### Returns

[`ProxyFetchError`](ProxyFetchError.md)

#### Overrides

Error.constructor

#### Defined in

[evmts-monorepo/packages/errors/src/client/ProxyFetchError.js:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/client/ProxyFetchError.js#L18)

## Properties

### \_tag

• **\_tag**: ``"ProxyFetchError"``

#### Defined in

[evmts-monorepo/packages/errors/src/client/ProxyFetchError.js:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/client/ProxyFetchError.js#L14)

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

[evmts-monorepo/packages/errors/src/client/ProxyFetchError.js:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/client/ProxyFetchError.js#L10)

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

evmts-monorepo/node_modules/.pnpm/bun-types@1.0.26/node_modules/bun-types/globals.d.ts:1532

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

evmts-monorepo/node_modules/.pnpm/@types+node@20.11.5/node_modules/@types/node/globals.d.ts:30

evmts-monorepo/node_modules/.pnpm/@types+node@20.11.19/node_modules/@types/node/globals.d.ts:30

evmts-monorepo/node_modules/.pnpm/bun-types@1.0.26/node_modules/bun-types/globals.d.ts:1534

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

evmts-monorepo/node_modules/.pnpm/bun-types@1.0.26/node_modules/bun-types/globals.d.ts:1525
