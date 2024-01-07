import type { TypedError } from './TypedError.js'
import { EVMErrorMessage } from '@ethereumjs/evm'

export type EvmError<
	TEVMErrorMessage extends EVMErrorMessage = EVMErrorMessage,
> = TypedError<TEVMErrorMessage>
