[@tevm/vm](../README.md) / [Exports](../modules.md) / NoProxyConfiguredError

# Class: NoProxyConfiguredError

## Hierarchy

- `Error`

  ↳ **`NoProxyConfiguredError`**

## Table of contents

### Constructors

- [constructor](NoProxyConfiguredError.md#constructor)

### Properties

- [\_tag](NoProxyConfiguredError.md#_tag)
- [cause](NoProxyConfiguredError.md#cause)
- [message](NoProxyConfiguredError.md#message)
- [name](NoProxyConfiguredError.md#name)
- [stack](NoProxyConfiguredError.md#stack)
- [prepareStackTrace](NoProxyConfiguredError.md#preparestacktrace)
- [stackTraceLimit](NoProxyConfiguredError.md#stacktracelimit)

### Methods

- [captureStackTrace](NoProxyConfiguredError.md#capturestacktrace)

## Constructors

### constructor

• **new NoProxyConfiguredError**(`method`): [`NoProxyConfiguredError`](NoProxyConfiguredError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | `string` |

#### Returns

[`NoProxyConfiguredError`](NoProxyConfiguredError.md)

#### Overrides

Error.constructor

#### Defined in

[vm/vm/src/errors/NoProxyConfiguredError.js:14](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/errors/NoProxyConfiguredError.js#L14)

## Properties

### \_tag

• **\_tag**: ``"NoProxyConfiguredError"``

#### Defined in

[vm/vm/src/errors/NoProxyConfiguredError.js:10](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/errors/NoProxyConfiguredError.js#L10)

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

• **name**: ``"NoProxyConfiguredError"``

#### Overrides

Error.name

#### Defined in

[vm/vm/src/errors/NoProxyConfiguredError.js:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/vm/src/errors/NoProxyConfiguredError.js#L6)

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
