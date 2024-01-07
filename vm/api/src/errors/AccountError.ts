import type { InvalidAddressError } from './InvalidAddressError.js'
import type { InvalidBalanceError } from './InvalidBalanceError.js'
import type { InvalidBytecodeError } from './InvalidBytecodeError.js'
import type { InvalidNonceError } from './InvalidNonceError.js'
import type { InvalidRequestError } from './InvalidRequestError.js'
import type { InvalidStorageRootError } from './InvalidStorageRootError.js'
import type { UnexpectedError } from './UnexpectedError.js'

export type AccountError =
	| InvalidAddressError
	| InvalidBalanceError
	| InvalidNonceError
	| InvalidStorageRootError
	| InvalidBytecodeError
	| InvalidRequestError
	| UnexpectedError
