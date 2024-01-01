import type { ContractError } from './ContractError.js'
import type { InvalidBytecodeError } from './InvalidBytecodeError.js'
import type { InvalidDeployedBytecodeError } from './InvalidDeployedBytecodeError.js'

export type ScriptError =
	| ContractError
	| InvalidBytecodeError
	| InvalidDeployedBytecodeError
