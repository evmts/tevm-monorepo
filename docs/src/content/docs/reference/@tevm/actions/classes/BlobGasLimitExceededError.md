---
editUrl: false
next: false
prev: false
title: "BlobGasLimitExceededError"
---

Error thrown when blob gas limit is exceeded

## Extends

- `Error`

## Constructors

### new BlobGasLimitExceededError()

> **new BlobGasLimitExceededError**(): [`BlobGasLimitExceededError`](/reference/tevm/actions/classes/blobgaslimitexceedederror/)

#### Returns

[`BlobGasLimitExceededError`](/reference/tevm/actions/classes/blobgaslimitexceedederror/)

#### Overrides

`Error.constructor`

#### Defined in

[packages/actions/src/eth/ethSendRawTransactionHandler.js:32](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethSendRawTransactionHandler.js#L32)

## Properties

### \_tag

> **\_tag**: `"BlobGasLimitExceededError"` = `'BlobGasLimitExceededError'`

#### Defined in

[packages/actions/src/eth/ethSendRawTransactionHandler.js:24](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethSendRawTransactionHandler.js#L24)

***

### cause?

> `optional` **cause**: `unknown`

#### Inherited from

`Error.cause`

#### Defined in

node\_modules/.pnpm/typescript@5.5.2/node\_modules/typescript/lib/lib.es2022.error.d.ts:24

***

### message

> **message**: `string`

#### Inherited from

`Error.message`

#### Defined in

node\_modules/.pnpm/typescript@5.5.2/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### name

> **name**: `"BlobGasLimitExceededError"` = `'BlobGasLimitExceededError'`

#### Overrides

`Error.name`

#### Defined in

[packages/actions/src/eth/ethSendRawTransactionHandler.js:30](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethSendRawTransactionHandler.js#L30)

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

`Error.stack`

#### Defined in

node\_modules/.pnpm/typescript@5.5.2/node\_modules/typescript/lib/lib.es5.d.ts:1078

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

`Error.prepareStackTrace`

#### Defined in

node\_modules/.pnpm/@types+node@20.14.8/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

`Error.stackTraceLimit`

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

`Error.captureStackTrace`

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

`Error.captureStackTrace`

##### Defined in

node\_modules/.pnpm/bun-types@1.1.17/node\_modules/bun-types/globals.d.ts:1613

#### captureStackTrace(targetObject, constructorOpt)

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

##### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

##### Returns

`void`

##### Inherited from

`Error.captureStackTrace`

##### Defined in

node\_modules/.pnpm/@types+node@20.12.14/node\_modules/@types/node/globals.d.ts:21
