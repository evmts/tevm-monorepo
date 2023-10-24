[@evmts/effect](/reference/effect/README.md) / [Exports](/reference/effect/modules.md) / ParseJsonError

# Class: ParseJsonError

Error thrown when the tsconfig.json file is not valid json

## Hierarchy

- `Error`

  ↳ **`ParseJsonError`**

## Table of contents

### Constructors

- [constructor](/reference/effect/classes/ParseJsonError.md#constructor)

### Properties

- [\_tag](/reference/effect/classes/ParseJsonError.md#_tag)
- [cause](/reference/effect/classes/ParseJsonError.md#cause)
- [message](/reference/effect/classes/ParseJsonError.md#message)
- [name](/reference/effect/classes/ParseJsonError.md#name)
- [stack](/reference/effect/classes/ParseJsonError.md#stack)
- [prepareStackTrace](/reference/effect/classes/ParseJsonError.md#preparestacktrace)
- [stackTraceLimit](/reference/effect/classes/ParseJsonError.md#stacktracelimit)

### Methods

- [captureStackTrace](/reference/effect/classes/ParseJsonError.md#capturestacktrace)

## Constructors

### constructor

• **new ParseJsonError**(`options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `Object` |
| `options.cause` | `unknown` |

#### Overrides

Error.constructor

#### Defined in

[effect/src/parseJson.js:17](https://github.com/evmts/evmts-monorepo/blob/main/effect/src/parseJson.js#L17)

## Properties

### \_tag

• **\_tag**: ``"ParseJsonError"``

#### Defined in

[effect/src/parseJson.js:12](https://github.com/evmts/evmts-monorepo/blob/main/effect/src/parseJson.js#L12)

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
