[**@tevm/errors**](../README.md)

***

[@tevm/errors](../globals.md) / BaseError

# Abstract Class: BaseError

Base class for custom errors in TEVM.
This class is abstract and should be extended by other error classes.

## Implements

## Extends

- `Error`

## Extended by

- [`AccountLockedError`](AccountLockedError.md)
- [`BlobGasLimitExceededError`](BlobGasLimitExceededError.md)
- [`BlockGasLimitExceededError`](BlockGasLimitExceededError.md)
- [`ChainIdMismatchError`](ChainIdMismatchError.md)
- [`ContractExecutionFailedError`](ContractExecutionFailedError.md)
- [`ExecutionError`](ExecutionError.md)
- [`GasLimitExceededError`](GasLimitExceededError.md)
- [`InsufficientFundsError`](InsufficientFundsError.md)
- [`InsufficientPermissionsError`](InsufficientPermissionsError.md)
- [`InternalError`](InternalError.md)
- [`InternalEvmError`](InternalEvmError.md)
- [`InvalidAddressError`](InvalidAddressError.md)
- [`InvalidGasPriceError`](InvalidGasPriceError.md)
- [`InvalidParamsError`](InvalidParamsError.md)
- [`InvalidRequestError`](InvalidRequestError.md)
- [`InvalidSignatureError`](InvalidSignatureError.md)
- [`InvalidTransactionError`](InvalidTransactionError.md)
- [`LimitExceededError`](LimitExceededError.md)
- [`MethodNotFoundError`](MethodNotFoundError.md)
- [`MethodNotSupportedError`](MethodNotSupportedError.md)
- [`NonceAlreadyUsedError`](NonceAlreadyUsedError.md)
- [`NonceTooHighError`](NonceTooHighError.md)
- [`NonceTooLowError`](NonceTooLowError.md)
- [`ParseError`](ParseError.md)
- [`PendingTransactionTimeoutError`](PendingTransactionTimeoutError.md)
- [`RateLimitExceededError`](RateLimitExceededError.md)
- [`ResourceNotFoundError`](ResourceNotFoundError.md)
- [`ResourceUnavailableError`](ResourceUnavailableError.md)
- [`RevertError`](RevertError.md)
- [`TransactionRejectedError`](TransactionRejectedError.md)
- [`TransactionTooLargeError`](TransactionTooLargeError.md)
- [`TransactionUnderpricedError`](TransactionUnderpricedError.md)
- [`UnknownBlockError`](UnknownBlockError.md)
- [`UnsupportedChainError`](UnsupportedChainError.md)
- [`ForkError`](ForkError.md)
- [`NoForkTransportSetError`](NoForkTransportSetError.md)
- [`NoForkUrlSetError`](NoForkUrlSetError.md)

## Constructors

### Constructor

> **new BaseError**(`shortMessage`, `args`, `_tag`, `code?`): `BaseError`

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `shortMessage` | `string` | `undefined` | A short, human-readable summary of the error. |
| `args` | [`BaseErrorParameters`](../interfaces/BaseErrorParameters.md) | `undefined` | - |
| `_tag` | `string` | `undefined` | Internal tag for the error. |
| `code?` | `number` | `0` | Error code analogous to the code in JSON RPC error. |

#### Returns

`BaseError`

#### Overrides

`Error.constructor`

## Properties

| Property | Type | Inherited from |
| ------ | ------ | ------ |
| <a id="_tag"></a> `_tag` | `string` | - |
| <a id="cause"></a> `cause` | `any` | `Error.cause` |
| <a id="code"></a> `code` | `number` | - |
| <a id="details"></a> `details` | `string` | - |
| <a id="docspath"></a> `docsPath` | `string` \| `undefined` | - |
| <a id="metamessages"></a> `metaMessages` | `string`[] \| `undefined` | - |
| <a id="shortmessage"></a> `shortMessage` | `string` | - |
| <a id="version"></a> `version` | `string` | - |

## Methods

### walk()

> **walk**(`fn?`): `unknown`

Walks through the error chain.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fn?` | `Function` | A function to execute on each error in the chain. |

#### Returns

`unknown`

The first error that matches the function, or the original error.
