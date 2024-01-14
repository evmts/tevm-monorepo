[@tevm/procedures](../README.md) / [Exports](../modules.md) / NoForkUrlSetError

# Class: NoForkUrlSetError

## Hierarchy

- `Error`

  ↳ **`NoForkUrlSetError`**

## Table of contents

### Constructors

- [constructor](NoForkUrlSetError.md#constructor)

### Properties

- [\_tag](NoForkUrlSetError.md#_tag)
- [cause](NoForkUrlSetError.md#cause)
- [message](NoForkUrlSetError.md#message)
- [name](NoForkUrlSetError.md#name)
- [stack](NoForkUrlSetError.md#stack)
- [prepareStackTrace](NoForkUrlSetError.md#preparestacktrace)
- [stackTraceLimit](NoForkUrlSetError.md#stacktracelimit)

### Methods

- [captureStackTrace](NoForkUrlSetError.md#capturestacktrace)

## Constructors

### constructor

• **new NoForkUrlSetError**(`message?`): [`NoForkUrlSetError`](NoForkUrlSetError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

#### Returns

[`NoForkUrlSetError`](NoForkUrlSetError.md)

#### Inherited from

Error.constructor

#### Defined in

node_modules/.pnpm/typescript@5.3.3/node_modules/typescript/lib/lib.es5.d.ts:1081

• **new NoForkUrlSetError**(`message?`, `options?`): [`NoForkUrlSetError`](NoForkUrlSetError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |
| `options?` | `ErrorOptions` |

#### Returns

[`NoForkUrlSetError`](NoForkUrlSetError.md)

#### Inherited from

Error.constructor

#### Defined in

node_modules/.pnpm/typescript@5.3.3/node_modules/typescript/lib/lib.es2022.error.d.ts:28

## Properties

### \_tag

• **\_tag**: ``"NoForkUrlSetError"``

#### Defined in

[vm/procedures/src/handlers/eth/getBalanceHandler.js:9](https://github.com/evmts/tevm-monorepo/blob/main/vm/procedures/src/handlers/eth/getBalanceHandler.js#L9)

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

• **name**: ``"NoForkUrlSetError"``

#### Overrides

Error.name

#### Defined in

[vm/procedures/src/handlers/eth/getBalanceHandler.js:14](https://github.com/evmts/tevm-monorepo/blob/main/vm/procedures/src/handlers/eth/getBalanceHandler.js#L14)

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
