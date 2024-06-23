[**tevm**](../../README.md) • **Docs**

***

[tevm](../../modules.md) / [errors](../README.md) / BaseError

# Class: BaseError

Base class for custom errors in TEVM.
This class is abstract and should be extended by other error classes.

## Implements

## Abstract

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

## Implements

- `BaseErrorType`

## Constructors

### new BaseError()

> **new BaseError**(`shortMessage`, `args`, `_tag`, `code`?): [`BaseError`](BaseError.md)

#### Parameters

• **shortMessage**: `string`

A short, human-readable summary of the error.

• **args**: [`BaseErrorParameters`](../type-aliases/BaseErrorParameters.md)

• **\_tag**: `string`

Internal tag for the error.

• **code?**: `number`

Error code analogous to the code in JSON RPC error.

#### Returns

[`BaseError`](BaseError.md)

#### Overrides

`Error.constructor`

#### Source

packages/errors/types/ethereum/BaseError.d.ts:35

## Properties

### \_tag

> **\_tag**: `string`

#### Implementation of

`BaseErrorType._tag`

#### Source

packages/errors/types/ethereum/BaseError.d.ts:39

***

### cause

> **cause**: `any`

#### Overrides

`Error.cause`

#### Source

packages/errors/types/ethereum/BaseError.d.ts:64

***

### code

> **code**: `number`

#### Implementation of

`BaseErrorType.code`

#### Source

packages/errors/types/ethereum/BaseError.d.ts:63

***

### details

> **details**: `string`

#### Implementation of

`BaseErrorType.details`

#### Source

packages/errors/types/ethereum/BaseError.d.ts:43

***

### docsPath

> **docsPath**: `undefined` \| `string`

#### Implementation of

`BaseErrorType.docsPath`

#### Source

packages/errors/types/ethereum/BaseError.d.ts:47

***

### message

> **message**: `string`

#### Implementation of

`BaseErrorType.message`

#### Inherited from

`Error.message`

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es5.d.ts:1077

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

#### Source

packages/errors/types/ethereum/BaseError.d.ts:51

***

### name

> **name**: `string`

#### Implementation of

`BaseErrorType.name`

#### Inherited from

`Error.name`

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es5.d.ts:1076

***

### shortMessage

> **shortMessage**: `string`

#### Implementation of

`BaseErrorType.shortMessage`

#### Source

packages/errors/types/ethereum/BaseError.d.ts:55

***

### stack?

> `optional` **stack**: `string`

#### Inherited from

`Error.stack`

#### Source

node\_modules/.pnpm/typescript@5.4.5/node\_modules/typescript/lib/lib.es5.d.ts:1078

***

### version

> **version**: `string`

#### Implementation of

`BaseErrorType.version`

#### Source

packages/errors/types/ethereum/BaseError.d.ts:59

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

#### Source

node\_modules/.pnpm/@types+node@20.14.5/node\_modules/@types/node/globals.d.ts:28

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

#### Inherited from

`Error.stackTraceLimit`

#### Source

node\_modules/.pnpm/@types+node@20.14.5/node\_modules/@types/node/globals.d.ts:30

## Methods

### walk()

> **walk**(`fn`?): `unknown`

Walks through the error chain.

#### Parameters

• **fn?**: `Function`

A function to execute on each error in the chain.

#### Returns

`unknown`

The first error that matches the function, or the original error.

#### Implementation of

`BaseErrorType.walk`

#### Source

packages/errors/types/ethereum/BaseError.d.ts:70

***

### captureStackTrace()

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Create .stack property on a target object

#### Parameters

• **targetObject**: `object`

• **constructorOpt?**: `Function`

#### Returns

`void`

#### Inherited from

`Error.captureStackTrace`

#### Source

node\_modules/.pnpm/@types+node@20.14.5/node\_modules/@types/node/globals.d.ts:21
