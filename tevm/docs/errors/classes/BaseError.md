[**tevm**](../../README.md)

***

[tevm](../../modules.md) / [errors](../README.md) / BaseError

# Class: `abstract` BaseError

Defined in: packages/errors/types/ethereum/BaseError.d.ts:29

Base class for custom errors in TEVM.
This class is abstract and should be extended by other error classes.

## Implements

## Extends

- `Error`

## Extended by

- [`SimulateError`](../../actions/classes/SimulateError.md)
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
- [`InvalidJsonError`](../../server/classes/InvalidJsonError.md)
- [`ReadRequestBodyError`](../../server/classes/ReadRequestBodyError.md)

## Implements

- `BaseErrorType`

## Constructors

### new BaseError()

> **new BaseError**(`shortMessage`, `args`, `_tag`, `code`?): [`BaseError`](BaseError.md)

Defined in: packages/errors/types/ethereum/BaseError.d.ts:36

#### Parameters

##### shortMessage

`string`

A short, human-readable summary of the error.

##### args

[`BaseErrorParameters`](../type-aliases/BaseErrorParameters.md)

##### \_tag

`string`

Internal tag for the error.

##### code?

`number`

Error code analogous to the code in JSON RPC error.

#### Returns

[`BaseError`](BaseError.md)

#### Overrides

`Error.constructor`

## Properties

### \_tag

> **\_tag**: `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:40

#### Implementation of

`BaseErrorType._tag`

***

### cause

> **cause**: `any`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:65

#### Overrides

`Error.cause`

***

### code

> **code**: `number`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:64

#### Implementation of

`BaseErrorType.code`

***

### details

> **details**: `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:44

#### Implementation of

`BaseErrorType.details`

***

### docsPath

> **docsPath**: `undefined` \| `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:48

#### Implementation of

`BaseErrorType.docsPath`

***

### message

> **message**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.2/node\_modules/typescript/lib/lib.es5.d.ts:1077

#### Implementation of

`BaseErrorType.message`

#### Inherited from

`Error.message`

***

### metaMessages

> **metaMessages**: `undefined` \| `string`[]

Defined in: packages/errors/types/ethereum/BaseError.d.ts:52

***

### name

> **name**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.2/node\_modules/typescript/lib/lib.es5.d.ts:1076

#### Implementation of

`BaseErrorType.name`

#### Inherited from

`Error.name`

***

### shortMessage

> **shortMessage**: `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:56

#### Implementation of

`BaseErrorType.shortMessage`

***

### stack?

> `optional` **stack**: `string`

Defined in: node\_modules/.pnpm/typescript@5.8.2/node\_modules/typescript/lib/lib.es5.d.ts:1078

#### Inherited from

`Error.stack`

***

### version

> **version**: `string`

Defined in: packages/errors/types/ethereum/BaseError.d.ts:60

#### Implementation of

`BaseErrorType.version`

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

Defined in: packages/errors/types/ethereum/BaseError.d.ts:71

Walks through the error chain.

#### Parameters

##### fn?

`Function`

A function to execute on each error in the chain.

#### Returns

`unknown`

The first error that matches the function, or the original error.

#### Implementation of

`BaseErrorType.walk`

***

### captureStackTrace()

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`

Defined in: node\_modules/.pnpm/@types+node@22.13.10/node\_modules/@types/node/globals.d.ts:136

Create .stack property on a target object

#### Parameters

##### targetObject

`object`

##### constructorOpt?

`Function`

#### Returns

`void`

#### Inherited from

`Error.captureStackTrace`
