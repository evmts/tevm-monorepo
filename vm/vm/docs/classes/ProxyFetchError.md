[@tevm/vm](../README.md) / [Exports](../modules.md) / ProxyFetchError

# Class: ProxyFetchError

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

[vm/vm/src/errors/ProxyFetchError.js:14](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/errors/ProxyFetchError.js#L14)

## Properties

### \_tag

• **\_tag**: ``"ProxyFetchError"``

#### Defined in

[vm/vm/src/errors/ProxyFetchError.js:10](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/errors/ProxyFetchError.js#L10)

___

### cause

• `Optional` **cause**: `unknown`

#### Inherited from

Error.cause

#### Defined in

node_modules/.pnpm/typescript@5.3.3/node_modules/typescript/lib/lib.es2022.error.d.ts:24

___

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

node_modules/.pnpm/typescript@5.3.3/node_modules/typescript/lib/lib.es5.d.ts:1076

___

### name

• **name**: ``"ProxyFetchError"``

#### Overrides

Error.name

#### Defined in

[vm/vm/src/errors/ProxyFetchError.js:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/errors/ProxyFetchError.js#L6)

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

node_modules/.pnpm/typescript@5.3.3/node_modules/typescript/lib/lib.es5.d.ts:1077

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

Error.prepareStackTrace

#### Defined in

node_modules/.pnpm/@types+node@20.9.1/node_modules/@types/node/globals.d.ts:11

node_modules/.pnpm/bun-types@1.0.21/node_modules/bun-types/types.d.ts:2235

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

node_modules/.pnpm/@types+node@20.9.1/node_modules/@types/node/globals.d.ts:13

node_modules/.pnpm/bun-types@1.0.21/node_modules/bun-types/types.d.ts:2239

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

node_modules/.pnpm/@types+node@20.9.1/node_modules/@types/node/globals.d.ts:4

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

node_modules/.pnpm/bun-types@1.0.21/node_modules/bun-types/types.d.ts:2228
