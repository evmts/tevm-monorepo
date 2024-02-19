[@tevm/schemas](../README.md) / [Modules](../modules.md) / [tevm](../modules/tevm.md) / InvalidAddressBookError

# Class: InvalidAddressBookError

[tevm](../modules/tevm.md).InvalidAddressBookError

Error thrown when an AddressBook is invalid.

## Hierarchy

- `TypeError`

  ↳ **`InvalidAddressBookError`**

## Table of contents

### Constructors

- [constructor](tevm.InvalidAddressBookError.md#constructor)

### Properties

- [cause](tevm.InvalidAddressBookError.md#cause)
- [message](tevm.InvalidAddressBookError.md#message)
- [name](tevm.InvalidAddressBookError.md#name)
- [stack](tevm.InvalidAddressBookError.md#stack)
- [prepareStackTrace](tevm.InvalidAddressBookError.md#preparestacktrace)
- [stackTraceLimit](tevm.InvalidAddressBookError.md#stacktracelimit)

### Methods

- [captureStackTrace](tevm.InvalidAddressBookError.md#capturestacktrace)

## Constructors

### constructor

• **new InvalidAddressBookError**(`options?`): [`InvalidAddressBookError`](tevm.InvalidAddressBookError.md)

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `options?` | `Object` | `{}` | The options for the error. |
| `options.cause` | `undefined` \| readonly [`ParseErrors`, `ParseErrors`] | `undefined` | The cause of the error. |
| `options.docs` | `undefined` \| `string` | `'https://tevm.sh/reference/errors'` | The documentation URL. |
| `options.message` | `undefined` \| `string` | `'Address book is invalid'` | The error message. |

#### Returns

[`InvalidAddressBookError`](tevm.InvalidAddressBookError.md)

#### Overrides

TypeError.constructor

#### Defined in

[evmts-monorepo/experimental/schemas/src/tevm/SAddressBook.js:64](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/tevm/SAddressBook.js#L64)

## Properties

### cause

• **cause**: `undefined` \| `string`

#### Inherited from

TypeError.cause

#### Defined in

[evmts-monorepo/experimental/schemas/src/tevm/SAddressBook.js:70](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/tevm/SAddressBook.js#L70)

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
