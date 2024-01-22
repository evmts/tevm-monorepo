**@tevm/schemas** ∙ [README](../../README.md) ∙ [API](../../API.md)

***

[API](../../API.md) > [ethereum](../README.md) > InvalidUINTError

# Class: InvalidUINTError

Error thrown when a UINT256 is invalid.
A uintbigint is invalid if it is not a non-negative integer or overflows

## Extends

- `TypeError`

## Constructors

### new InvalidUINTError(options)

> **new InvalidUINTError**(`options`): [`InvalidUINTError`](InvalidUINTError.md)

#### Parameters

▪ **options**: `object`

The options for the error.

▪ **options.cause**: `undefined` \| readonly [`ParseErrors`, `ParseErrors`]

The cause of the error.

▪ **options.docs**: `undefined` \| `string`= `'https://tevm.sh/reference/errors'`

The documentation URL.

▪ **options.message**: `undefined` \| `string`= `undefined`

The error message.

▪ **options.size**: [`UINTSize`](../type-aliases/UINTSize.md)

The size of the uint.

▪ **options.uint**: `bigint`

The invalid uint256 bigint.

#### Overrides

TypeError.constructor

#### Source

[experimental/schemas/src/ethereum/SUINT/Errors.js:28](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SUINT/Errors.js#L28)

## Properties

### cause

> **cause**: `undefined` \| `string`

#### Inherited from

TypeError.cause

#### Source

[experimental/schemas/src/ethereum/SUINT/Errors.js:38](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/ethereum/SUINT/Errors.js#L38)

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
