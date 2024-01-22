import type { BaseCallError } from './BaseCallError.js'
import type { InvalidDataError } from './InvalidDataError.js'
import type { InvalidDeployedBytecodeError } from './InvalidDeployedBytecodeError.js'
import type { InvalidSaltError } from './InvalidSaltError.js'

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
