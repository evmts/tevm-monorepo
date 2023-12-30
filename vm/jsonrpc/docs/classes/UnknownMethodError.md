[@tevm/jsonrpc](../README.md) / [Exports](../modules.md) / UnknownMethodError

# Class: UnknownMethodError

## Hierarchy

- `Error`

  ↳ **`UnknownMethodError`**

## Table of contents

### Constructors

- [constructor](UnknownMethodError.md#constructor)

### Properties

- [\_tag](UnknownMethodError.md#_tag)
- [cause](UnknownMethodError.md#cause)
- [message](UnknownMethodError.md#message)
- [name](UnknownMethodError.md#name)
- [stack](UnknownMethodError.md#stack)
- [prepareStackTrace](UnknownMethodError.md#preparestacktrace)
- [stackTraceLimit](UnknownMethodError.md#stacktracelimit)

### Methods

- [captureStackTrace](UnknownMethodError.md#capturestacktrace)

## Constructors

### constructor

• **new UnknownMethodError**(`request`): [`UnknownMethodError`](UnknownMethodError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `request` | `never` |

#### Returns

[`UnknownMethodError`](UnknownMethodError.md)

#### Overrides

Error.constructor

#### Defined in

[vm/jsonrpc/src/createJsonRpcClient.ts:24](https://github.com/evmts/tevm-monorepo/blob/main/vm/jsonrpc/src/createJsonRpcClient.ts#L24)

## Properties

### \_tag

• **\_tag**: `string` = `'UnknownMethodError'`

#### Defined in

[vm/jsonrpc/src/createJsonRpcClient.ts:23](https://github.com/evmts/tevm-monorepo/blob/main/vm/jsonrpc/src/createJsonRpcClient.ts#L23)

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

• **name**: `string` = `'UnknownMethodError'`

#### Overrides

Error.name

#### Defined in

[vm/jsonrpc/src/createJsonRpcClient.ts:22](https://github.com/evmts/tevm-monorepo/blob/main/vm/jsonrpc/src/createJsonRpcClient.ts#L22)

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

node_modules/.pnpm/bun-types@1.0.12/node_modules/bun-types/types.d.ts:13469

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

node_modules/.pnpm/@types+node@20.9.1/node_modules/@types/node/globals.d.ts:13

node_modules/.pnpm/bun-types@1.0.12/node_modules/bun-types/types.d.ts:13473

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

node_modules/.pnpm/bun-types@1.0.12/node_modules/bun-types/types.d.ts:13462
