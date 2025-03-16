import { Block } from '@tevm/block'
import type { ExecutionError, InternalError, RevertError } from '@tevm/errors'
import type { CallHandlerOptsError } from './callHandlerOpts.js'
import type { ExecuteCallError } from './executeCall.js'
import type { HandleRunTxError } from './handleEvmError.js'
import type { ValidateCallParamsError } from './validateCallParams.js'

/**
 * Interface for common error properties that all error types must have
 */
export interface ErrorProperties {
	name: string
	message: string
	code?: number
}

/**
 * All errors that can occur during a TEVM call.
 * This type is strongly typed if using `throwOnFail: false`.
 *
 * @example
 * ```typescript
 * import { TevmCallError } from 'tevm/errors'
 * import { createMemoryClient, tevmCall } from 'tevm'
 *
 * const client = createMemoryClient()
 *
 * const result = await tevmCall(client, {
 *   throwOnFail: false,
 *   to: '0x...',
 *   data: '0x...',
 * })
 *
 * const errors = result.errors satisfies Array<TevmCallError> | undefined
 * if (errors) {
 *   errors.forEach((error) => console.error(error))
 * }
 * ```
 *
 * If `throwOnFail: true` is used (the default), the errors are thrown directly. This type can then be used to catch the errors.
 *
 * @example
 * ```typescript
 * import { TevmCallError } from 'tevm/errors'
 * import { createMemoryClient, tevmCall } from 'tevm'
 *
 * const client = createMemoryClient()
 *
 * try {
 *   await tevmCall(client, {
 *     to: '0x...',
 *     data: '0x...',
 *   })
 * } catch (error) {
 *   const typedError = error as TevmCallError
 *   switch (typedError.name) {
 *     case 'ValidateCallParamsError':
 *     case 'CallHandlerOptsError':
 *     case 'InternalError':
 *     case 'ExecutionError':
 *     case 'RevertError':
 *     case 'HandleRunTxError':
 *     case 'ExecuteCallError':
 *       handleIt(typedError)
 *       break
 *     default:
 *       throw error
 *   }
 * }
 * ```
 */
export type TevmCallError = (
	| ValidateCallParamsError
	| CallHandlerOptsError
	| InternalError
	| ExecutionError
	| RevertError
	| HandleRunTxError
	| ExecuteCallError
	| Block
) &
	ErrorProperties
