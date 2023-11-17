[@evmts/effect](../README.md) / [Modules](../modules.md) / [resolve](../modules/resolve.md) / CouldNotResolveImportError

# Class: CouldNotResolveImportError

[resolve](../modules/resolve.md).CouldNotResolveImportError

Error thrown when 'node:resolve' throws

## Hierarchy

- `Error`

  ↳ **`CouldNotResolveImportError`**

## Table of contents

### Constructors

- [constructor](resolve.CouldNotResolveImportError.md#constructor)

### Properties

- [\_tag](resolve.CouldNotResolveImportError.md#_tag)
- [cause](resolve.CouldNotResolveImportError.md#cause)
- [message](resolve.CouldNotResolveImportError.md#message)
- [name](resolve.CouldNotResolveImportError.md#name)
- [stack](resolve.CouldNotResolveImportError.md#stack)
- [prepareStackTrace](resolve.CouldNotResolveImportError.md#preparestacktrace)
- [stackTraceLimit](resolve.CouldNotResolveImportError.md#stacktracelimit)

### Methods

- [captureStackTrace](resolve.CouldNotResolveImportError.md#capturestacktrace)

## Constructors

### constructor

• **new CouldNotResolveImportError**(`importPath`, `absolutePath`, `cause`): [`CouldNotResolveImportError`](resolve.CouldNotResolveImportError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `importPath` | `string` |
| `absolutePath` | `string` |
| `cause` | `Error` |

#### Returns

[`CouldNotResolveImportError`](resolve.CouldNotResolveImportError.md)

#### Overrides

Error.constructor

#### Defined in

[packages/effect/src/resolve.js:31](https://github.com/evmts/evmts-monorepo/blob/main/packages/effect/src/resolve.js#L31)

## Properties

### \_tag

• **\_tag**: ``"CouldNotResolveImportError"``

#### Defined in

[packages/effect/src/resolve.js:20](https://github.com/evmts/evmts-monorepo/blob/main/packages/effect/src/resolve.js#L20)

___

### cause

• `Optional` **cause**: `unknown`

#### Inherited from

Error.cause

#### Defined in

node_modules/.pnpm/typescript@5.2.2/node_modules/typescript/lib/lib.es2022.error.d.ts:24

___

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

node_modules/.pnpm/typescript@5.2.2/node_modules/typescript/lib/lib.es5.d.ts:1068

___

### name

• **name**: ``"CouldNotResolveImportError"``

#### Overrides

Error.name

#### Defined in

[packages/effect/src/resolve.js:25](https://github.com/evmts/evmts-monorepo/blob/main/packages/effect/src/resolve.js#L25)

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

node_modules/.pnpm/typescript@5.2.2/node_modules/typescript/lib/lib.es5.d.ts:1069

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

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

node_modules/.pnpm/@types+node@20.9.1/node_modules/@types/node/globals.d.ts:13

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
