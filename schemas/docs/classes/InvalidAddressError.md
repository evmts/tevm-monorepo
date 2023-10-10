[@evmts/schemas](../README.md) / [Exports](../modules.md) / InvalidAddressError

# Class: InvalidAddressError

Error thrown when an Address is invalid.

**`Example`**

```ts
throw new InvalidAddressError({ address: '0x1234' });
```

## Hierarchy

- `TypeError`

  ↳ **`InvalidAddressError`**

## Table of contents

### Constructors

- [constructor](InvalidAddressError.md#constructor)

### Properties

- [cause](InvalidAddressError.md#cause)
- [message](InvalidAddressError.md#message)
- [name](InvalidAddressError.md#name)
- [stack](InvalidAddressError.md#stack)
- [prepareStackTrace](InvalidAddressError.md#preparestacktrace)
- [stackTraceLimit](InvalidAddressError.md#stacktracelimit)

### Methods

- [captureStackTrace](InvalidAddressError.md#capturestacktrace)

## Constructors

### constructor

• **new InvalidAddressError**(`options`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | `Object` | The options for the error. |
| `options.address` | `unknown` | The invalid address. |
| `options.cause` | `undefined` \| readonly [`ParseErrors`, `ParseErrors`] | The cause of the error. |
| `options.docs` | `undefined` \| `string` | The documentation URL. |
| `options.message` | `undefined` \| `string` | The error message. |

#### Overrides

TypeError.constructor

#### Defined in

[schemas/src/SAddress.js:48](https://github.com/evmts/evmts-monorepo/blob/baee3b8d/schemas/src/SAddress.js#L48)

## Properties

### cause

• **cause**: `undefined` \| `string`

#### Inherited from

TypeError.cause

#### Defined in

[schemas/src/SAddress.js:55](https://github.com/evmts/evmts-monorepo/blob/baee3b8d/schemas/src/SAddress.js#L55)

___

### message

• **message**: `string`

#### Inherited from

TypeError.message

#### Defined in

node_modules/.pnpm/typescript@5.2.2/node_modules/typescript/lib/lib.es5.d.ts:1068

___

### name

• **name**: `string`

#### Inherited from

TypeError.name

#### Defined in

node_modules/.pnpm/typescript@5.2.2/node_modules/typescript/lib/lib.es5.d.ts:1067

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

TypeError.stack

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

TypeError.prepareStackTrace

#### Defined in

node_modules/.pnpm/@types+node@20.7.2/node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

TypeError.stackTraceLimit

#### Defined in

node_modules/.pnpm/@types+node@20.7.2/node_modules/@types/node/globals.d.ts:13

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

TypeError.captureStackTrace

#### Defined in

node_modules/.pnpm/@types+node@20.7.2/node_modules/@types/node/globals.d.ts:4
