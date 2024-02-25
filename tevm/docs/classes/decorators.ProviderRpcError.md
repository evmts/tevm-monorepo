[tevm](../README.md) / [Modules](../modules.md) / [decorators](../modules/decorators.md) / ProviderRpcError

# Class: ProviderRpcError

[decorators](../modules/decorators.md).ProviderRpcError

## Hierarchy

- `Error`

  ↳ **`ProviderRpcError`**

## Table of contents

### Constructors

- [constructor](decorators.ProviderRpcError.md#constructor)

### Properties

- [cause](decorators.ProviderRpcError.md#cause)
- [code](decorators.ProviderRpcError.md#code)
- [details](decorators.ProviderRpcError.md#details)
- [message](decorators.ProviderRpcError.md#message)
- [name](decorators.ProviderRpcError.md#name)
- [stack](decorators.ProviderRpcError.md#stack)
- [prepareStackTrace](decorators.ProviderRpcError.md#preparestacktrace)
- [stackTraceLimit](decorators.ProviderRpcError.md#stacktracelimit)

### Methods

- [captureStackTrace](decorators.ProviderRpcError.md#capturestacktrace)

## Constructors

### constructor

• **new ProviderRpcError**(`code`, `message`): [`ProviderRpcError`](decorators.ProviderRpcError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | `number` |
| `message` | `string` |

#### Returns

[`ProviderRpcError`](decorators.ProviderRpcError.md)

#### Overrides

Error.constructor

#### Defined in

evmts-monorepo/packages/decorators/types/eip1193/EIP1193Events.d.ts:12

## Properties

### cause

• `Optional` **cause**: `unknown`

#### Inherited from

Error.cause

#### Defined in

.nvm/versions/node/v20.9.0/lib/node_modules/typescript/lib/lib.es2022.error.d.ts:24

___

### code

• **code**: `number`

#### Defined in

evmts-monorepo/packages/decorators/types/eip1193/EIP1193Events.d.ts:10

___

### details

• **details**: `string`

#### Defined in

evmts-monorepo/packages/decorators/types/eip1193/EIP1193Events.d.ts:11

___

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

.nvm/versions/node/v20.9.0/lib/node_modules/typescript/lib/lib.es5.d.ts:1076

___

### name

• **name**: `string`

#### Inherited from

Error.name

#### Defined in

.nvm/versions/node/v20.9.0/lib/node_modules/typescript/lib/lib.es5.d.ts:1075

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
