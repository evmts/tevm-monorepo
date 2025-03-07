[**@tevm/actions**](../README.md) • **Docs**

***

[@tevm/actions](../globals.md) / BlobGasLimitExceededError

# Class: BlobGasLimitExceededError

Error thrown when blob gas limit is exceeded

## Extends

- `Error`

## Constructors

### new BlobGasLimitExceededError()

> **new BlobGasLimitExceededError**(): [`BlobGasLimitExceededError`](BlobGasLimitExceededError.md)

#### Returns

[`BlobGasLimitExceededError`](BlobGasLimitExceededError.md)

#### Overrides

`Error.constructor`

#### Defined in

[packages/actions/src/eth/ethSendRawTransactionHandler.js:34](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethSendRawTransactionHandler.js#L34)

## Properties

### \_tag

> **\_tag**: `"BlobGasLimitExceededError"` = `'BlobGasLimitExceededError'`

#### Defined in

[packages/actions/src/eth/ethSendRawTransactionHandler.js:26](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethSendRawTransactionHandler.js#L26)

***

### cause?

> `optional` **cause**: `unknown`

#### Inherited from

`Error.cause`

#### Defined in

node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es2022.error.d.ts:24

***

### message

> **message**: `string`

#### Inherited from

`Error.message`

#### Defined in

node\_modules/.pnpm/typescript@5.6.2/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### name

> **name**: `"BlobGasLimitExceededError"` = `'BlobGasLimitExceededError'`

#### Overrides

`Error.name`

#### Defined in

[packages/actions/src/eth/ethSendRawTransactionHandler.js:32](https://github.com/evmts/tevm-monorepo/blob/main/packages/actions/src/eth/ethSendRawTransactionHandler.js#L32)

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

`Error.stack`

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

`Error.prepareStackTrace`

#### Defined in

node\_modules/.pnpm/@types+node@22.7.3/node\_modules/@types/node/globals.d.ts:143

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

`Error.stackTraceLimit`

#### Defined in

node\_modules/.pnpm/@types+node@22.7.3/node\_modules/@types/node/globals.d.ts:145

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

node\_modules/.pnpm/@types+node@22.7.3/node\_modules/@types/node/globals.d.ts:136

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

node\_modules/.pnpm/bun-types@1.1.29/node\_modules/bun-types/globals.d.ts:1630

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
