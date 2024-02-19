[@tevm/schemas](../README.md) / [Modules](../modules.md) / [ethereum](../modules/ethereum.md) / InvalidAddressError

# Class: InvalidAddressError

[ethereum](../modules/ethereum.md).InvalidAddressError

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

- [constructor](ethereum.InvalidAddressError.md#constructor)

### Properties

- [cause](ethereum.InvalidAddressError.md#cause)
- [message](ethereum.InvalidAddressError.md#message)
- [name](ethereum.InvalidAddressError.md#name)
- [stack](ethereum.InvalidAddressError.md#stack)
- [prepareStackTrace](ethereum.InvalidAddressError.md#preparestacktrace)
- [stackTraceLimit](ethereum.InvalidAddressError.md#stacktracelimit)

### Methods

- [captureStackTrace](ethereum.InvalidAddressError.md#capturestacktrace)

## Constructors

### constructor

• **new InvalidAddressError**(`options`): [`InvalidAddressError`](ethereum.InvalidAddressError.md)

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `options` | `Object` | `undefined` | The options for the error. |
| `options.address` | `unknown` | `undefined` | The invalid address. |
| `options.cause` | `undefined` \| readonly [`ParseErrors`, `ParseErrors`] | `undefined` | The cause of the error. |
| `options.docs` | `undefined` \| `string` | `'https://tevm.sh/reference/errors'` | The documentation URL. |
| `options.message` | `undefined` \| `string` | `undefined` | The error message. |

#### Returns

[`InvalidAddressError`](ethereum.InvalidAddressError.md)

#### Overrides

TypeError.constructor

#### Defined in

[evmts-monorepo/experimental/schemas/src/ethereum/SAddress/Errors.js:25](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SAddress/Errors.js#L25)

## Properties

### cause

• **cause**: `undefined` \| `string`

#### Inherited from

TypeError.cause

#### Defined in

[evmts-monorepo/experimental/schemas/src/ethereum/SAddress/Errors.js:32](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SAddress/Errors.js#L32)

___

### message

• **message**: `string`

#### Inherited from

TypeError.message

#### Defined in

.nvm/versions/node/v20.9.0/lib/node_modules/typescript/lib/lib.es5.d.ts:1076

___

### name

• **name**: `string`

#### Inherited from

TypeError.name

#### Defined in

.nvm/versions/node/v20.9.0/lib/node_modules/typescript/lib/lib.es5.d.ts:1075

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

TypeError.stack

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

TypeError.prepareStackTrace

#### Defined in

evmts-monorepo/node_modules/.pnpm/@types+node@20.11.5/node_modules/@types/node/globals.d.ts:28

evmts-monorepo/node_modules/.pnpm/@types+node@20.11.19/node_modules/@types/node/globals.d.ts:28

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

TypeError.stackTraceLimit

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

TypeError.captureStackTrace

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

TypeError.captureStackTrace

#### Defined in

evmts-monorepo/node_modules/.pnpm/@types+node@20.11.19/node_modules/@types/node/globals.d.ts:21
