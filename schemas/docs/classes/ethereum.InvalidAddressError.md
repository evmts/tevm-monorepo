[@evmts/schemas](/reference/schemas/README.md) / [Modules](/reference/schemas/modules.md) / [ethereum](/reference/schemas/modules/ethereum.md) / InvalidAddressError

# Class: InvalidAddressError

[ethereum](/reference/schemas/modules/ethereum.md).InvalidAddressError

Error thrown when an Address is invalid.

**`Example`**

```ts
throw new InvalidAddressError({ address: '0x1234' });
```
[Solidity docs](https://docs.soliditylang.org/en/latest/types.html#address)

## Hierarchy

- `TypeError`

  ↳ **`InvalidAddressError`**

## Table of contents

### Constructors

- [constructor](/reference/schemas/classes/ethereum.InvalidAddressError.md#constructor)

### Properties

- [cause](/reference/schemas/classes/ethereum.InvalidAddressError.md#cause)
- [message](/reference/schemas/classes/ethereum.InvalidAddressError.md#message)
- [name](/reference/schemas/classes/ethereum.InvalidAddressError.md#name)
- [stack](/reference/schemas/classes/ethereum.InvalidAddressError.md#stack)
- [prepareStackTrace](/reference/schemas/classes/ethereum.InvalidAddressError.md#preparestacktrace)
- [stackTraceLimit](/reference/schemas/classes/ethereum.InvalidAddressError.md#stacktracelimit)

### Methods

- [captureStackTrace](/reference/schemas/classes/ethereum.InvalidAddressError.md#capturestacktrace)

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

[schemas/src/ethereum/SAddress/Errors.js:25](https://github.com/evmts/evmts-monorepo/blob/main/schemas/src/ethereum/SAddress/Errors.js#L25)

## Properties

### cause

• **cause**: `undefined` \| `string`

#### Inherited from

TypeError.cause

#### Defined in

[schemas/src/ethereum/SAddress/Errors.js:32](https://github.com/evmts/evmts-monorepo/blob/main/schemas/src/ethereum/SAddress/Errors.js#L32)

___

### message

• **message**: `string`

#### Inherited from

TypeError.message

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1068

___

### name

• **name**: `string`

#### Inherited from

TypeError.name

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1067

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

TypeError.stack

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

TypeError.prepareStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

TypeError.stackTraceLimit

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

TypeError.captureStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:4
