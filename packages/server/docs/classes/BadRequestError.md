[@tevm/server](../README.md) / [Exports](../modules.md) / BadRequestError

# Class: BadRequestError

Error thrown when request is malformed

## Hierarchy

- `Error`

  ↳ **`BadRequestError`**

## Table of contents

### Constructors

- [constructor](BadRequestError.md#constructor)

### Properties

- [\_tag](BadRequestError.md#_tag)
- [cause](BadRequestError.md#cause)
- [message](BadRequestError.md#message)
- [name](BadRequestError.md#name)
- [stack](BadRequestError.md#stack)
- [prepareStackTrace](BadRequestError.md#preparestacktrace)
- [stackTraceLimit](BadRequestError.md#stacktracelimit)

### Methods

- [captureStackTrace](BadRequestError.md#capturestacktrace)

## Constructors

### constructor

• **new BadRequestError**(`message?`): [`BadRequestError`](BadRequestError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

#### Returns

[`BadRequestError`](BadRequestError.md)

#### Inherited from

Error.constructor

#### Defined in

.nvm/versions/node/v20.9.0/lib/node_modules/typescript/lib/lib.es5.d.ts:1081

• **new BadRequestError**(`message?`, `options?`): [`BadRequestError`](BadRequestError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |
| `options?` | `ErrorOptions` |

#### Returns

[`BadRequestError`](BadRequestError.md)

#### Inherited from

Error.constructor

#### Defined in

.nvm/versions/node/v20.9.0/lib/node_modules/typescript/lib/lib.es5.d.ts:1081

## Properties

### \_tag

• **\_tag**: ``"BadRequestError"``

#### Defined in

[evmts-monorepo/packages/server/src/BadRequestError.js:13](https://github.com/evmts/tevm-monorepo/blob/main/packages/server/src/BadRequestError.js#L13)

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

• **name**: ``"BadRequestError"``

#### Overrides

Error.name

#### Defined in

[evmts-monorepo/packages/server/src/BadRequestError.js:9](https://github.com/evmts/tevm-monorepo/blob/main/packages/server/src/BadRequestError.js#L9)

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

evmts-monorepo/node_modules/.pnpm/bun-types@1.0.26/node_modules/bun-types/globals.d.ts:1532

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

evmts-monorepo/node_modules/.pnpm/@types+node@20.11.5/node_modules/@types/node/globals.d.ts:30

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

evmts-monorepo/node_modules/.pnpm/bun-types@1.0.26/node_modules/bun-types/globals.d.ts:1525
