import type { TypedError } from './TypedError.js'
import { EVMErrorMessage } from '@ethereumjs/evm'

/**
 * Error type of errors thrown while internally executing a call in the EVM
 */
export type EvmError<
	TEVMErrorMessage extends EVMErrorMessage = EVMErrorMessage,
> = TypedError<TEVMErrorMessage>
