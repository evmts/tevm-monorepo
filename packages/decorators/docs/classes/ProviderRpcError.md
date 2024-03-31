[@tevm/decorators](../README.md) / [Exports](../modules.md) / ProviderRpcError

# Class: ProviderRpcError

## Hierarchy

- `Error`

  ↳ **`ProviderRpcError`**

## Table of contents

### Constructors

- [constructor](ProviderRpcError.md#constructor)

### Properties

- [cause](ProviderRpcError.md#cause)
- [code](ProviderRpcError.md#code)
- [details](ProviderRpcError.md#details)
- [message](ProviderRpcError.md#message)
- [name](ProviderRpcError.md#name)
- [stack](ProviderRpcError.md#stack)
- [prepareStackTrace](ProviderRpcError.md#preparestacktrace)
- [stackTraceLimit](ProviderRpcError.md#stacktracelimit)

### Methods

- [captureStackTrace](ProviderRpcError.md#capturestacktrace)

## Constructors

### constructor

• **new ProviderRpcError**(`code`, `message`): [`ProviderRpcError`](ProviderRpcError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `code` | `number` |
| `message` | `string` |

#### Returns

[`ProviderRpcError`](ProviderRpcError.md)

#### Overrides

Error.constructor

#### Defined in

[evmts-monorepo/packages/decorators/src/eip1193/EIP1193Events.ts:21](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/EIP1193Events.ts#L21)

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

[evmts-monorepo/packages/decorators/src/eip1193/EIP1193Events.ts:18](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/EIP1193Events.ts#L18)

___

### details

• **details**: `string`

#### Defined in

[evmts-monorepo/packages/decorators/src/eip1193/EIP1193Events.ts:19](https://github.com/evmts/tevm-monorepo/blob/main/packages/decorators/src/eip1193/EIP1193Events.ts#L19)

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

evmts-monorepo/node_modules/.pnpm/bun-types@1.0.36/node_modules/bun-types/globals.d.ts:1644

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

evmts-monorepo/node_modules/.pnpm/@types+node@20.11.5/node_modules/@types/node/globals.d.ts:30

evmts-monorepo/node_modules/.pnpm/bun-types@1.0.36/node_modules/bun-types/globals.d.ts:1648

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

evmts-monorepo/node_modules/.pnpm/bun-types@1.0.36/node_modules/bun-types/globals.d.ts:1637
