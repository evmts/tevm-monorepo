[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / BaseError

# Class: `abstract` BaseError

Defined in: [packages/errors/src/ethereum/BaseError.js:38](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L38)

Base class for custom errors in TEVM.
This class is abstract and should be extended by other error classes.

## Implements

## Extends

- `Error`

## Extended by

- [`NoForkTransportSetError`](NoForkTransportSetError.md)
- [`ForkError`](ForkError.md)
- [`ParseError`](ParseError.md)
- [`RevertError`](RevertError.md)
- [`InternalError`](InternalError.md)
- [`ExecutionError`](ExecutionError.md)
- [`NonceTooLowError`](NonceTooLowError.md)
- [`NonceTooHighError`](NonceTooHighError.md)
- [`UnknownBlockError`](UnknownBlockError.md)
- [`AccountLockedError`](AccountLockedError.md)
- [`InvalidParamsError`](InvalidParamsError.md)
- [`LimitExceededError`](LimitExceededError.md)
- [`InvalidAddressError`](InvalidAddressError.md)
- [`InvalidRequestError`](InvalidRequestError.md)
- [`MethodNotFoundError`](MethodNotFoundError.md)
- [`ChainIdMismatchError`](ChainIdMismatchError.md)
- [`InvalidGasPriceError`](InvalidGasPriceError.md)
- [`GasLimitExceededError`](GasLimitExceededError.md)
- [`InvalidSignatureError`](InvalidSignatureError.md)
- [`NonceAlreadyUsedError`](NonceAlreadyUsedError.md)
- [`ResourceNotFoundError`](ResourceNotFoundError.md)
- [`UnsupportedChainError`](UnsupportedChainError.md)
- [`InsufficientFundsError`](InsufficientFundsError.md)
- [`RateLimitExceededError`](RateLimitExceededError.md)
- [`InvalidTransactionError`](InvalidTransactionError.md)
- [`MethodNotSupportedError`](MethodNotSupportedError.md)
- [`ResourceUnavailableError`](ResourceUnavailableError.md)
- [`TransactionRejectedError`](TransactionRejectedError.md)
- [`TransactionTooLargeError`](TransactionTooLargeError.md)
- [`BlockGasLimitExceededError`](BlockGasLimitExceededError.md)
- [`TransactionUnderpricedError`](TransactionUnderpricedError.md)
- [`ContractExecutionFailedError`](ContractExecutionFailedError.md)
- [`InsufficientPermissionsError`](InsufficientPermissionsError.md)
- [`PendingTransactionTimeoutError`](PendingTransactionTimeoutError.md)
- [`InternalEvmError`](InternalEvmError.md)

## Constructors

### new BaseError()

> **new BaseError**(`shortMessage`, `args`, `_tag`, `code`?): [`BaseError`](BaseError.md)

Defined in: [packages/errors/src/ethereum/BaseError.js:45](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L45)

#### Parameters

##### shortMessage

`string`

A short, human-readable summary of the error.

##### args

[`BaseErrorParameters`](../interfaces/BaseErrorParameters.md)

##### \_tag

`string`

Internal tag for the error.

##### code?

`number` = `0`

Error code analogous to the code in JSON RPC error.

#### Returns

[`BaseError`](BaseError.md)

#### Overrides

`Error.constructor`

## Properties

### \_tag

> **\_tag**: `string`

Defined in: [packages/errors/src/ethereum/BaseError.js:82](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L82)

***

### cause

> **cause**: `any`

Defined in: [packages/errors/src/ethereum/BaseError.js:114](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L114)

#### Inherited from

`Error.cause`

***

### code

> **code**: `number`

Defined in: [packages/errors/src/ethereum/BaseError.js:112](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L112)

***

### details

> **details**: `string`

Defined in: [packages/errors/src/ethereum/BaseError.js:91](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L91)

***

### docsPath

> **docsPath**: `undefined` \| `string`

Defined in: [packages/errors/src/ethereum/BaseError.js:96](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L96)

***

### message

> **message**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.2/node\_modules/typescript/lib/lib.es5.d.ts:1077

#### Inherited from

`Error.message`

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Defined in: [packages/errors/src/ethereum/BaseError.js:100](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L100)

***

### name

> **name**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.2/node\_modules/typescript/lib/lib.es5.d.ts:1076

#### Inherited from

`Error.name`

***

### shortMessage

> **shortMessage**: `string`

Defined in: [packages/errors/src/ethereum/BaseError.js:104](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L104)

***

### stack?

> `optional` **stack**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.2/node\_modules/typescript/lib/lib.es5.d.ts:1078

#### Inherited from

`Error.stack`

***

### version

> **version**: `string`

Defined in: [packages/errors/src/ethereum/BaseError.js:108](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L108)

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

### walk()

> **walk**(`fn`?): `unknown`

Defined in: [packages/errors/src/ethereum/BaseError.js:137](https://github.com/evmts/tevm-monorepo/blob/main/packages/errors/src/ethereum/BaseError.js#L137)

Walks through the error chain.

#### Parameters

##### fn?

`Function`

A function to execute on each error in the chain.

#### Returns

`unknown`

The first error that matches the function, or the original error.

***

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

Defined in: node\_modules/.pnpm/@types+node@22.14.1/node\_modules/@types/node/globals.d.ts:136

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

Defined in: node\_modules/.pnpm/bun-types@1.2.5/node\_modules/bun-types/globals.d.ts:1441

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
