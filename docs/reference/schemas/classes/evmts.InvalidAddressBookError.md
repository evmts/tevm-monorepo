[@evmts/schemas](/reference/schema/README.md) / [Modules](/reference/schema/modules.md) / [evmts](/reference/schema/modules/evmts.md) / InvalidAddressBookError

# Class: InvalidAddressBookError

[evmts](/reference/schema/modules/evmts.md).InvalidAddressBookError

Error thrown when an AddressBook is invalid.

## Hierarchy

- `TypeError`

  ↳ **`InvalidAddressBookError`**

## Table of contents

### Constructors

- [constructor](/reference/schema/classes/evmts.InvalidAddressBookError.md#constructor)

### Properties

- [cause](/reference/schema/classes/evmts.InvalidAddressBookError.md#cause)
- [message](/reference/schema/classes/evmts.InvalidAddressBookError.md#message)
- [name](/reference/schema/classes/evmts.InvalidAddressBookError.md#name)
- [stack](/reference/schema/classes/evmts.InvalidAddressBookError.md#stack)
- [prepareStackTrace](/reference/schema/classes/evmts.InvalidAddressBookError.md#preparestacktrace)
- [stackTraceLimit](/reference/schema/classes/evmts.InvalidAddressBookError.md#stacktracelimit)

### Methods

- [captureStackTrace](/reference/schema/classes/evmts.InvalidAddressBookError.md#capturestacktrace)

## Constructors

### constructor

• **new InvalidAddressBookError**(`options?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | `Object` | The options for the error. |
| `options.cause` | `undefined` \| readonly [`ParseErrors`, `ParseErrors`] | The cause of the error. |
| `options.docs` | `undefined` \| `string` | The documentation URL. |
| `options.message` | `undefined` \| `string` | The error message. |

#### Overrides

TypeError.constructor

#### Defined in

[schemas/src/evmts/SAddressBook.js:64](https://github.com/evmts/evmts-monorepo/blob/main/schemas/src/evmts/SAddressBook.js#L64)

## Properties

### cause

• **cause**: `undefined` \| `string`

#### Inherited from

TypeError.cause

#### Defined in

[schemas/src/evmts/SAddressBook.js:70](https://github.com/evmts/evmts-monorepo/blob/main/schemas/src/evmts/SAddressBook.js#L70)

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
