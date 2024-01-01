import type { BaseCallError } from './BaseCallError.js'
import type { InvalidDataError } from './InvalidDataError.js'
import type { InvalidDeployedBytecodeError } from './InvalidDeployedBytecodeError.js'
import type { InvalidSaltError } from './InvalidSaltError.js'

export type CallError =
	| BaseCallError
	| InvalidSaltError
	| InvalidDataError
	| InvalidDeployedBytecodeError
