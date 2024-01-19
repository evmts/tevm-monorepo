import type { ContractError } from './ContractError.js'
import type { InvalidBytecodeError } from './InvalidBytecodeError.js'
import type { InvalidDeployedBytecodeError } from './InvalidDeployedBytecodeError.js'

/**
 * Error type of errors thrown by the tevm_script procedure
 * @example
 * const {errors} = await tevm.script({address: '0x1234'})
 * if (errors?.length) {
 *  console.log(errors[0].name) // InvalidBytecodeError
 *  console.log(errors[0].message) // Invalid bytecode should be a hex string: 1234
 * }
 */
export type ScriptError =
	| ContractError
	| InvalidBytecodeError
	| InvalidDeployedBytecodeError
