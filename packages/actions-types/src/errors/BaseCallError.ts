import type { EvmError } from './EvmError.js'
import type { InvalidAddressError } from './InvalidAddressError.js'
import type { InvalidBalanceError } from './InvalidBalanceError.js'
import type { InvalidBlobVersionedHashesError } from './InvalidBlobVersionedHashesError.js'
import type { InvalidBlockError } from './InvalidBlockError.js'
import type { InvalidCallerError } from './InvalidCallerError.js'
import type { InvalidDepthError } from './InvalidDepthError.js'
import type { InvalidGasLimitError } from './InvalidGasLimitError.js'
import type { InvalidGasPriceError } from './InvalidGasPriceError.js'
import type { InvalidGasRefundError } from './InvalidGasRefundError.js'
import type { InvalidNonceError } from './InvalidNonceError.js'
import type { InvalidOriginError } from './InvalidOriginError.js'
import type { InvalidRequestError } from './InvalidRequestError.js'
import type { InvalidSelfdestructError } from './InvalidSelfdestructError.js'
import type { InvalidSkipBalanceError } from './InvalidSkipBalanceError.js'
import type { InvalidStorageRootError } from './InvalidStorageRootError.js'
import type { InvalidToError } from './InvalidToError.js'
import type { InvalidValueError } from './InvalidValueError.js'
import type { UnexpectedError } from './UnexpectedError.js'

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
