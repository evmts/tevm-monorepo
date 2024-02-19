[@tevm/errors](../README.md) / [Exports](../modules.md) / UnsupportedMethodError

# Class: UnsupportedMethodError

Error when a given JSON-RPC method is not supported

## Hierarchy

- `Error`

  ↳ **`UnsupportedMethodError`**

## Table of contents

### Constructors

- [constructor](UnsupportedMethodError.md#constructor)

### Properties

- [\_tag](UnsupportedMethodError.md#_tag)
- [cause](UnsupportedMethodError.md#cause)
- [message](UnsupportedMethodError.md#message)
- [name](UnsupportedMethodError.md#name)
- [stack](UnsupportedMethodError.md#stack)
- [prepareStackTrace](UnsupportedMethodError.md#preparestacktrace)
- [stackTraceLimit](UnsupportedMethodError.md#stacktracelimit)

### Methods

- [captureStackTrace](UnsupportedMethodError.md#capturestacktrace)

## Constructors

### constructor

• **new UnsupportedMethodError**(`method`): [`UnsupportedMethodError`](UnsupportedMethodError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | `string` |

#### Returns

[`UnsupportedMethodError`](UnsupportedMethodError.md)

#### Overrides

Error.constructor

#### Defined in

[evmts-monorepo/packages/errors/src/client/UnsupportedMethodError.js:17](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/client/UnsupportedMethodError.js#L17)

## Properties

### \_tag

• **\_tag**: ``"UnsupportedMethodError"``

#### Defined in

[evmts-monorepo/packages/errors/src/client/UnsupportedMethodError.js:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/client/UnsupportedMethodError.js#L13)

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

• **name**: ``"UnsupportedMethodError"``

#### Overrides

Error.name

#### Defined in

[evmts-monorepo/packages/errors/src/client/UnsupportedMethodError.js:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/client/UnsupportedMethodError.js#L9)

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
