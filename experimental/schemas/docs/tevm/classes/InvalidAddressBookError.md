[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [tevm](../README.md) / InvalidAddressBookError

# Class: InvalidAddressBookError

Error thrown when an AddressBook is invalid.

## Extends

- `TypeError`

## Constructors

### new InvalidAddressBookError()

> **new InvalidAddressBookError**(`options`?): [`InvalidAddressBookError`](InvalidAddressBookError.md)

#### Parameters

• **options?** = `{}`

The options for the error.

• **options.cause?**: `undefined` \| readonly [`ParseErrors`, `ParseErrors`]

The cause of the error.

• **options.docs?**: `undefined` \| `string` = `'https://tevm.sh/reference/errors'`

The documentation URL.

• **options.message?**: `undefined` \| `string` = `'Address book is invalid'`

The error message.

#### Returns

[`InvalidAddressBookError`](InvalidAddressBookError.md)

#### Overrides

`TypeError.constructor`

#### Defined in

[experimental/schemas/src/tevm/SAddressBook.js:64](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/tevm/SAddressBook.js#L64)

## Properties

### cause

> **cause**: `undefined` \| `string`

#### Inherited from

`TypeError.cause`

#### Defined in

[experimental/schemas/src/tevm/SAddressBook.js:70](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/tevm/SAddressBook.js#L70)

***

### message

> **message**: `string`

#### Inherited from

`TypeError.message`

#### Defined in

node\_modules/.pnpm/typescript@5.5.4/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### name

> **name**: `string`

#### Inherited from

`TypeError.name`

#### Defined in

node\_modules/.pnpm/typescript@5.5.4/node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

`TypeError.stack`

#### Defined in

node\_modules/.pnpm/typescript@5.5.4/node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Optional override for formatting stack traces

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Parameters

• **err**: `Error`

• **stackTraces**: `CallSite`[]

#### Returns

`any`

#### Inherited from

`TypeError.prepareStackTrace`

#### Defined in

node\_modules/.pnpm/@types+node@20.14.8/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

`TypeError.stackTraceLimit`

#### Defined in

node\_modules/.pnpm/@types+node@20.14.8/node\_modules/@types/node/globals.d.ts:30

## Methods

### captureStackTrace()

#### captureStackTrace(targetObject, constructorOpt)

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

##### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

##### Returns

`void`

##### Inherited from

`TypeError.captureStackTrace`

##### Defined in

node\_modules/.pnpm/@types+node@20.14.8/node\_modules/@types/node/globals.d.ts:21

#### captureStackTrace(targetObject, constructorOpt)

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

##### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

##### Returns

`void`

##### Inherited from

`TypeError.captureStackTrace`

##### Defined in

node\_modules/.pnpm/@types+node@22.5.1/node\_modules/@types/node/globals.d.ts:67
