[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [actions](../README.md) / BlobGasLimitExceededError

# Class: BlobGasLimitExceededError

Defined in: packages/actions/types/eth/ethSendRawTransactionHandler.d.ts:4

Error thrown when blob gas limit is exceeded

## Extends

- `Error`

## Constructors

### new BlobGasLimitExceededError()

> **new BlobGasLimitExceededError**(): `BlobGasLimitExceededError`

Defined in: packages/actions/types/eth/ethSendRawTransactionHandler.d.ts:5

#### Returns

`BlobGasLimitExceededError`

#### Overrides

`Error.constructor`

## Properties

### \_tag

> **\_tag**: `"BlobGasLimitExceededError"`

Defined in: packages/actions/types/eth/ethSendRawTransactionHandler.d.ts:9

***

### cause?

> `optional` **cause**: `unknown`

Defined in: node\_modules/.pnpm/typescript@5.8.2/node\_modules/typescript/lib/lib.es2022.error.d.ts:26

#### Inherited from

`Error.cause`

***

### message

> **message**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.2/node\_modules/typescript/lib/lib.es5.d.ts:1077

#### Inherited from

`Error.message`

***

### name

> **name**: `"BlobGasLimitExceededError"`

Defined in: packages/actions/types/eth/ethSendRawTransactionHandler.d.ts:14

#### Overrides

`Error.name`

***

### stack?

> `optional` **stack**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.2/node\_modules/typescript/lib/lib.es5.d.ts:1078

#### Inherited from

`Error.stack`

***

### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Defined in: node\_modules/.pnpm/@types+node@22.13.10/node\_modules/@types/node/globals.d.ts:143

Optional override for formatting stack traces

#### Parameters

##### err

`Error`

##### stackTraces

`CallSite`[]

#### Returns

`any`

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

`Error.prepareStackTrace`

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

Defined in: node\_modules/.pnpm/@types+node@22.13.10/node\_modules/@types/node/globals.d.ts:145

#### Inherited from

`Error.stackTraceLimit`

## Methods

### captureStackTrace()

#### Call Signature

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Defined in: node\_modules/.pnpm/@types+node@22.13.10/node\_modules/@types/node/globals.d.ts:136

Create .stack property on a target object

##### Parameters

###### targetObject

`object`

###### constructorOpt?

`Function`

##### Returns

`void`

##### Inherited from

`Error.captureStackTrace`

#### Call Signature

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Defined in: node\_modules/.pnpm/@types+node@22.13.11/node\_modules/@types/node/globals.d.ts:136

Create .stack property on a target object

##### Parameters

###### targetObject

`object`

###### constructorOpt?

`Function`

##### Returns

`void`

##### Inherited from

`Error.captureStackTrace`
