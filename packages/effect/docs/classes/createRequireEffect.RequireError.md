[@tevm/effect](../README.md) / [Modules](../modules.md) / [createRequireEffect](../modules/createRequireEffect.md) / RequireError

# Class: RequireError

[createRequireEffect](../modules/createRequireEffect.md).RequireError

## Hierarchy

- `Error`

  ↳ **`RequireError`**

## Table of contents

### Constructors

- [constructor](createRequireEffect.RequireError.md#constructor)

### Properties

- [\_tag](createRequireEffect.RequireError.md#_tag)
- [cause](createRequireEffect.RequireError.md#cause)
- [message](createRequireEffect.RequireError.md#message)
- [name](createRequireEffect.RequireError.md#name)
- [stack](createRequireEffect.RequireError.md#stack)
- [prepareStackTrace](createRequireEffect.RequireError.md#preparestacktrace)
- [stackTraceLimit](createRequireEffect.RequireError.md#stacktracelimit)

### Methods

- [captureStackTrace](createRequireEffect.RequireError.md#capturestacktrace)

## Constructors

### constructor

• **new RequireError**(`url`, `options?`): [`RequireError`](createRequireEffect.RequireError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `options` | `Object` |

#### Returns

[`RequireError`](createRequireEffect.RequireError.md)

#### Overrides

Error.constructor

#### Defined in

[evmts-monorepo/packages/effect/src/createRequireEffect.js:30](https://github.com/evmts/tevm-monorepo/blob/main/packages/effect/src/createRequireEffect.js#L30)

## Properties

### \_tag

• **\_tag**: `string` = `'RequireError'`

#### Defined in

[evmts-monorepo/packages/effect/src/createRequireEffect.js:23](https://github.com/evmts/tevm-monorepo/blob/main/packages/effect/src/createRequireEffect.js#L23)

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

evmts-monorepo/node_modules/.pnpm/@types+node@20.9.1/node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

evmts-monorepo/node_modules/.pnpm/@types+node@20.9.1/node_modules/@types/node/globals.d.ts:13

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

evmts-monorepo/node_modules/.pnpm/@types+node@20.9.1/node_modules/@types/node/globals.d.ts:4
