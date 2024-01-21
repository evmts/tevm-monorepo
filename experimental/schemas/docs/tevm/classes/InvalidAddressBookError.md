**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [tevm](../README.md) > InvalidAddressBookError

# Class: InvalidAddressBookError

Error thrown when an AddressBook is invalid.

## Extends

- `TypeError`

## Constructors

### new InvalidAddressBookError(options)

> **new InvalidAddressBookError**(`options`?): [`InvalidAddressBookError`](InvalidAddressBookError.md)

#### Parameters

▪ **options?**: `object`= `{}`

The options for the error.

▪ **options.cause?**: `undefined` \| readonly [`ParseErrors`, `ParseErrors`]

The cause of the error.

▪ **options.docs?**: `undefined` \| `string`= `'https://tevm.dev/reference/errors'`

The documentation URL.

▪ **options.message?**: `undefined` \| `string`= `'Address book is invalid'`

The error message.

#### Overrides

TypeError.constructor

#### Source

[experimental/schemas/src/tevm/SAddressBook.js:64](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/tevm/SAddressBook.js#L64)

## Properties

### cause

> **cause**: `undefined` \| `string`

#### Inherited from

TypeError.cause

#### Source

[experimental/schemas/src/tevm/SAddressBook.js:70](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/tevm/SAddressBook.js#L70)

***

### message

> **message**: `string`

#### Inherited from

TypeError.message

#### Source

node\_modules/.pnpm/typescript@5.3.3/node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### name

> **name**: `string`

#### Inherited from

TypeError.name

#### Source

node\_modules/.pnpm/typescript@5.3.3/node\_modules/typescript/lib/lib.es5.d.ts:1075

***

### stack

> **stack**?: `string`

#### Inherited from

TypeError.stack

#### Source

node\_modules/.pnpm/typescript@5.3.3/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### prepareStackTrace

> **`static`** **prepareStackTrace**?: (`err`, `stackTraces`) => `any`

Optional override for formatting stack traces

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

Optional override for formatting stack traces

#### Parameters

▪ **err**: `Error`

▪ **stackTraces**: `CallSite`[]

#### Returns

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

TypeError.prepareStackTrace

#### Source

node\_modules/.pnpm/@types+node@20.11.5/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> **`static`** **stackTraceLimit**: `number`

#### Inherited from

TypeError.stackTraceLimit

#### Source

node\_modules/.pnpm/@types+node@20.11.5/node\_modules/@types/node/globals.d.ts:30

## Methods

### captureStackTrace()

> **`static`** **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

#### Parameters

▪ **targetObject**: `object`

▪ **constructorOpt?**: `Function`

#### Inherited from

TypeError.captureStackTrace

#### Source

node\_modules/.pnpm/@types+node@20.11.5/node\_modules/@types/node/globals.d.ts:21

***
Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
