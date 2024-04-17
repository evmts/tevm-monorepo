**@tevm/schemas** • [Readme](../../README.md) \| [API](../../modules.md)

***

[@tevm/schemas](../../README.md) / [common](../README.md) / InvalidBlockNumberError

# Class: InvalidBlockNumberError

Error thrown when a BlockNumber is invalid.
A block number is invalid if it is not a non-negative integer.

## Extends

- `TypeError`

## Constructors

### new InvalidBlockNumberError(options)

> **new InvalidBlockNumberError**(`options`): [`InvalidBlockNumberError`](InvalidBlockNumberError.md)

#### Parameters

• **options**= `{}`

The options for the error.

• **options\.blockNumber**: `unknown`

The invalid block number.

• **options\.cause**: `undefined` \| readonly [`ParseErrors`, `ParseErrors`]

The cause of the error.

• **options\.docs**: `undefined` \| `string`= `'https://tevm.sh/reference/errors'`

The documentation URL.

• **options\.message**: `undefined` \| `string`= `undefined`

The error message.

#### Returns

[`InvalidBlockNumberError`](InvalidBlockNumberError.md)

#### Overrides

`TypeError.constructor`

#### Source

[experimental/schemas/src/common/SBlockNumber.js:62](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/common/SBlockNumber.js#L62)

## Properties

### cause

> **cause**: `undefined` \| `string`

#### Inherited from

`TypeError.cause`

#### Source

[experimental/schemas/src/common/SBlockNumber.js:69](https://github.com/evmts/tevm-monorepo/blob/main/experimental/schemas/src/common/SBlockNumber.js#L69)

***

### message

> **message**: `string`

#### Inherited from

`TypeError.message`

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### name

> **name**: `string`

#### Inherited from

`TypeError.name`

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### stack?

> **`optional`** **stack**: `string`

#### Inherited from

`TypeError.stack`

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### prepareStackTrace()?

> **`static`** **`optional`** **prepareStackTrace**: (`err`, `stackTraces`) => `any`

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

#### Source

node\_modules/.pnpm/@types+node@20.11.5/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> **`static`** **stackTraceLimit**: `number`

#### Inherited from

`TypeError.stackTraceLimit`

#### Source

node\_modules/.pnpm/@types+node@20.11.5/node\_modules/@types/node/globals.d.ts:30

## Methods

### captureStackTrace()

#### captureStackTrace(targetObject, constructorOpt)

> **`static`** **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

##### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

##### Returns

`void`

##### Inherited from

`TypeError.captureStackTrace`

##### Source

node\_modules/.pnpm/@types+node@20.11.5/node\_modules/@types/node/globals.d.ts:21

#### captureStackTrace(targetObject, constructorOpt)

> **`static`** **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

##### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

##### Returns

`void`

##### Inherited from

`TypeError.captureStackTrace`

##### Source

node\_modules/.pnpm/@types+node@20.11.19/node\_modules/@types/node/globals.d.ts:21
