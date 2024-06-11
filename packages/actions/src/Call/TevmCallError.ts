import type { InternalError, ExecutionError, RevertError } from '@tevm/errors'
import type { CallHandlerOptsError } from './callHandlerOpts.js'
import type { ValidateCallParamsError } from './validateCallParams.js'

export type TevmCallError =
	| ValidateCallParamsError
	| CallHandlerOptsError
	| InternalError
	| ExecutionError
	| RevertError
