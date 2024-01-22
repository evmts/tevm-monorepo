import type { UnexpectedError } from '../UnexpectedError.js'
import type { EvmError } from '../ethereumjs/index.js'
import type {
	InvalidAddressError,
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

/**
 * Errors returned by all call based tevm procedures including call, contract, and script
 */
export type BaseCallError =
	| EvmError
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
