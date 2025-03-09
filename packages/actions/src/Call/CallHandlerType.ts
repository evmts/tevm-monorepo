import type { CallEvents } from '../common/CallEvents.js'
import type { CallParams } from './CallParams.js'
import type { CallResult } from './CallResult.js'

/**
 * Parameters for the call handler, extending CallParams with event handlers
 * These event handlers are not JSON-serializable, so they are kept separate from the base CallParams
 */
export type CallHandlerParams = CallParams & CallEvents

/**
 * Executes a call against the VM, similar to `eth_call` but with more options for controlling the execution environment.
 *
 * This low-level function is used internally by higher-level functions like `contract` and `script`, which are designed to interact with deployed contracts or undeployed scripts, respectively.
 *
 * @param {CallHandlerParams} action - The parameters for the call, including optional event handlers.
 * @returns {Promise<CallResult>} The result of the call, including execution details and any returned data.
 * @throws {TevmCallError} If `throwOnFail` is true, returns `TevmCallError` as value.
 *
 * @example
 * ```typescript
 * import { createTevmNode } from 'tevm/node'
 * import { callHandler } from 'tevm/actions'
 *
 * const client = createTevmNode()
 *
 * const call = callHandler(client)
 *
 * const res = await call({
 *   to: '0x123...',
 *   data: '0x123...',
 *   from: '0x123...',
 *   gas: 1000000n,
 *   gasPrice: 1n,
 *   skipBalance: true,
 *   // Optional event handlers
 *   onStep: (step, next) => {
 *     console.log(`Executing ${step.opcode.name} at PC=${step.pc}`)
 *     next?.()
 *   }
 * })
 *
 * console.log(res)
 * ```
 *
 * @see {@link https://tevm.sh/reference/tevm/memory-client/functions/tevmCall | tevmCall}
 * @see {@link CallParams}
 * @see {@link CallResult}
 */
export type CallHandler = (action: CallHandlerParams) => Promise<CallResult>
