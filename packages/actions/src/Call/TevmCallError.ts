import type { ExecutionError, InternalError, RevertError } from '@tevm/errors'
import type { CallHandlerOptsError } from './callHandlerOpts.js'
import type { ValidateCallParamsError } from './validateCallParams.js'
import type { HandleRunTxError } from './handleEvmError.js'
import type { ExecuteCallError } from './executeCall.js'

/**
 * All errors that can occur during a Tevm call
 * The type is strongly typed if using `throwOnFail: false`
 * @example
 * ```typescript`
 * import {TevmCallError} from 'tevm/errors'
 * import {createMemoryClient} from 'tevm'
 *
 * const client = createMemoryClient()
 *
 * const result = await client.tevmCall({
 *   throwOnFail: false,
 *   to: '0x...',
 *   data: '0x...',
 * })
 *
 * const errors = result.errors satisfies Array<TevmCallError> | undefined
 * ```
 * If `throwOnFail: true` is used (the default), the errors are thrown directly. This type can then be used to catch the errors.
 * @example
 * ```typescript
 * import {TevmCallError} from 'tevm/errors'
 * import {createMemoryClient} from 'tevm'
 *
 * const client = createMemoryClient()
 *
 * try {
 *   await client.tevmCall({
 *   to: '0x...',
 *   data: '0x...',
 *   })
 * } catch (error) {
 *   const typedError = error as TevmCallError
 *   switch (typedErrorl.name) {
 *     case 'ValidateCallParamsError':
 *     case 'CallHandlerOptsError':
 *     case 'InternalError':
 *     case 'ExecutionError':
 *     case 'RevertError':
 *       handleIt()
 *     default:
 *       throw error
 *   }
 * }
 * ```
 */
export type TevmCallError =
	| ValidateCallParamsError
	| CallHandlerOptsError
	| InternalError
	| ExecutionError
	| RevertError
	| ValidateCallParamsError
	| HandleRunTxError
	| ExecuteCallError
	| InternalError
