[**@tevm/schemas**](../../README.md) • **Docs**

***

[@tevm/schemas](../../modules.md) / [ethereum](../README.md) / InvalidBytesError

# Class: InvalidBytesError

Error thrown when an invalid Bytes is provided.

## Extends

- `TypeError`

## Constructors

### new InvalidBytesError()

> **new InvalidBytesError**(`options`): [`InvalidBytesError`](InvalidBytesError.md)

#### Parameters

• **options** = `{}`

The options for the error.

• **options.cause**: `undefined` \| readonly [`ParseErrors`, `ParseErrors`]

The cause of the error.

• **options.docs**: `undefined` \| `string` = `'https://tevm.sh/reference/errors'`

The documentation URL.

• **options.message**: `undefined` \| `string` = `...`

The error message.

• **options.value**: `unknown`

The invalid hex value.

#### Returns

[`InvalidBytesError`](InvalidBytesError.md)

#### Overrides

`TypeError.constructor`

#### Defined in

[experimental/schemas/src/ethereum/SBytes/Errors.js:19](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytes/Errors.js#L19)

## Properties

### cause

> **cause**: `undefined` \| `string`

#### Inherited from

`TypeError.cause`

#### Defined in

[experimental/schemas/src/ethereum/SBytes/Errors.js:26](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SBytes/Errors.js#L26)

***

### message

> **message**: `string`

#### Inherited from

`TypeError.message`

#### Defined in

node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### name

> **name**: `string`

#### Inherited from

`TypeError.name`

#### Defined in

node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

`TypeError.stack`

#### Defined in

node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Optional override for formatting stack traces

#### Parameters

• **err**: `Error`

• **stackTraces**: `CallSite`[]

#### Returns

`any`

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

`TypeError.prepareStackTrace`

#### Defined in

node\_modules/.pnpm/@types+node@22.7.3/node\_modules/@types/node/globals.d.ts:143

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

`TypeError.stackTraceLimit`

#### Defined in

node\_modules/.pnpm/@types+node@22.7.3/node\_modules/@types/node/globals.d.ts:145

## Methods

### captureStackTrace()

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

#### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

#### Returns

`void`

#### Inherited from

`TypeError.captureStackTrace`

#### Defined in

node\_modules/.pnpm/@types+node@22.7.3/node\_modules/@types/node/globals.d.ts:136
