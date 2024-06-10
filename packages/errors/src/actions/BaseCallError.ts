import type { ExecutionRevertedError } from 'viem'
import type { UnexpectedError } from '../UnexpectedError.js'
import type { ExecutionErrorParameters } from '../ethereum/ExecutionErrorError.js'
import type {
	InvalidBalanceError,
	InvalidBlobVersionedHashesError,
	InvalidBlockError,
	InvalidCallerError,
	InvalidDepthError,
	InvalidGasLimitError,
	InvalidGasPriceError,
	InvalidGasRefundError,
	InvalidNonceError,
	InvalidOriginError,
	InvalidRequestError,
	InvalidSelfdestructError,
	InvalidSkipBalanceError,
	InvalidStorageRootError,
	InvalidToError,
	InvalidValueError,
} from '../input/index.js'
import type { InvalidAddressError } from '../ethereum/InvalidAddressError.js'

/**
 * Errors returned by all call based tevm procedures including call, contract, and script
 */
export type BaseCallError =
	| ExecutionErrorParameters
	| ExecutionRevertedError
	| InvalidRequestError
	| InvalidAddressError
	| InvalidBalanceError
	| InvalidBlobVersionedHashesError
	| InvalidBlockError
	| InvalidCallerError
	| InvalidDepthError
	| InvalidGasLimitError
	| InvalidGasPriceError
	| InvalidGasRefundError
	| InvalidNonceError
	| InvalidOriginError
	| InvalidSelfdestructError
	| InvalidSkipBalanceError
	| InvalidStorageRootError
	| InvalidToError
	| InvalidValueError
	| UnexpectedError
