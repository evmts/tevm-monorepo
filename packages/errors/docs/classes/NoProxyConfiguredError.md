[@tevm/errors](../README.md) / [Exports](../modules.md) / NoProxyConfiguredError

# Class: NoProxyConfiguredError

Error thrown when a action or request cannot be fulfilled
without a proxy url being configured

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

[evmts-monorepo/packages/errors/src/client/NoProxyConfiguredError.js:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/client/NoProxyConfiguredError.js#L18)

## Properties

### \_tag

• **\_tag**: ``"NoProxyConfiguredError"``

#### Defined in

[evmts-monorepo/packages/errors/src/client/NoProxyConfiguredError.js:14](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/client/NoProxyConfiguredError.js#L14)

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

[evmts-monorepo/packages/errors/src/client/NoProxyConfiguredError.js:10](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/client/NoProxyConfiguredError.js#L10)

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
