import type { TypedError } from '../TypedError.js'

/**
 * Error thrown when deployedBytecode parameter is invalid
 */
export type InvalidDeployedBytecodeError =
	TypedError<'InvalidDeployedBytecodeError'>
