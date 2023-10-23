[@evmts/effect](/reference/effect/README.md) / [Exports](/reference/effect/modules.md) / CreateRequireError

# Class: CreateRequireError

## Hierarchy

- `Error`

  ↳ **`CreateRequireError`**

## Table of contents

### Constructors

- [constructor](/reference/effect/classes/CreateRequireError.md#constructor)

### Properties

- [\_tag](/reference/effect/classes/CreateRequireError.md#_tag)
- [cause](/reference/effect/classes/CreateRequireError.md#cause)
- [message](/reference/effect/classes/CreateRequireError.md#message)
- [name](/reference/effect/classes/CreateRequireError.md#name)
- [stack](/reference/effect/classes/CreateRequireError.md#stack)
- [prepareStackTrace](/reference/effect/classes/CreateRequireError.md#preparestacktrace)
- [stackTraceLimit](/reference/effect/classes/CreateRequireError.md#stacktracelimit)

### Methods

- [captureStackTrace](/reference/effect/classes/CreateRequireError.md#capturestacktrace)

## Constructors

### constructor

• **new CreateRequireError**(`url`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `options` | `Object` |

#### Overrides

Error.constructor

#### Defined in

[effect/src/createRequireEffect.js:17](https://github.com/evmts/evmts-monorepo/blob/main/effect/src/createRequireEffect.js#L17)

## Properties

### \_tag

• **\_tag**: ``"CreateRequireError"``

#### Defined in

[effect/src/createRequireEffect.js:10](https://github.com/evmts/evmts-monorepo/blob/main/effect/src/createRequireEffect.js#L10)

___

### cause

• `Optional` **cause**: `unknown`

#### Inherited from

Error.cause

#### Defined in

node_modules/typescript/lib/lib.es2022.error.d.ts:24

___

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1068

___

### name

• **name**: `string`

#### Inherited from

Error.name

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1067

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1069

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

node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

node_modules/@types/node/globals.d.ts:13

## Methods

### captureStackTrace

▸ `Static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

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

node_modules/@types/node/globals.d.ts:4
