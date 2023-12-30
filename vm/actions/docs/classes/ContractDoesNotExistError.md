[@tevm/actions](../README.md) / [Exports](../modules.md) / ContractDoesNotExistError

# Class: ContractDoesNotExistError

## Hierarchy

- `Error`

  ↳ **`ContractDoesNotExistError`**

## Table of contents

### Constructors

- [constructor](ContractDoesNotExistError.md#constructor)

### Properties

- [\_tag](ContractDoesNotExistError.md#_tag)
- [cause](ContractDoesNotExistError.md#cause)
- [message](ContractDoesNotExistError.md#message)
- [name](ContractDoesNotExistError.md#name)
- [stack](ContractDoesNotExistError.md#stack)
- [prepareStackTrace](ContractDoesNotExistError.md#preparestacktrace)
- [stackTraceLimit](ContractDoesNotExistError.md#stacktracelimit)

### Methods

- [captureStackTrace](ContractDoesNotExistError.md#capturestacktrace)

## Constructors

### constructor

• **new ContractDoesNotExistError**(`contractAddress`): [`ContractDoesNotExistError`](ContractDoesNotExistError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `contractAddress` | `string` |

#### Returns

[`ContractDoesNotExistError`](ContractDoesNotExistError.md)

#### Overrides

Error.constructor

#### Defined in

[vm/actions/src/errors/ContractDoesNotExistError.js:15](https://github.com/evmts/tevm-monorepo/blob/main/vm/actions/src/errors/ContractDoesNotExistError.js#L15)

## Properties

### \_tag

• **\_tag**: ``"ContractDoesNotExistError"``

#### Defined in

[vm/actions/src/errors/ContractDoesNotExistError.js:10](https://github.com/evmts/tevm-monorepo/blob/main/vm/actions/src/errors/ContractDoesNotExistError.js#L10)

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

• **name**: ``"ContractDoesNotExistError"``

#### Overrides

Error.name

#### Defined in

[vm/actions/src/errors/ContractDoesNotExistError.js:6](https://github.com/evmts/tevm-monorepo/blob/main/vm/actions/src/errors/ContractDoesNotExistError.js#L6)

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

node_modules/.pnpm/bun-types@1.0.15/node_modules/bun-types/types.d.ts:37226

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

node_modules/.pnpm/@types+node@20.9.1/node_modules/@types/node/globals.d.ts:13

node_modules/.pnpm/bun-types@1.0.15/node_modules/bun-types/types.d.ts:37230

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

node_modules/.pnpm/bun-types@1.0.15/node_modules/bun-types/types.d.ts:37219
