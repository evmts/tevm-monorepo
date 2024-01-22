import type {
	InvalidDataError,
	InvalidDeployedBytecodeError,
	InvalidSaltError,
} from '../input/index.js'
import type { BaseCallError } from './BaseCallError.js'

/**
 * Error returned by call tevm procedure
 * @example
 * const {errors} = await tevm.call({address: '0x1234'})
 * if (errors?.length) {
 *  console.log(errors[0].name) // InvalidDataError
 * }
 */
export type CallError =
	| BaseCallError
	| InvalidSaltError
	| InvalidDataError
	| InvalidDeployedBytecodeError
