import type { CallParams } from './CallParams.js'
import type { CallResult } from './CallResult.js'

/**
 * Executes a call against the VM, similar to `eth_call` but with more options for controlling the execution environment.
 *
 * This low-level function is used internally by higher-level functions like `contract` and `script`, which are designed to interact with deployed contracts or undeployed scripts, respectively.
 *
 * @param {CallParams} action - The parameters for the call.
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
 * })
 *
 * console.log(res)
 * ```
 *
 * @see {@link https://tevm.sh/reference/tevm/memory-client/functions/tevmCall | tevmCall}
 * @see {@link CallParams}
 * @see {@link CallResult}
 */
export type CallHandler = (action: CallParams) => Promise<CallResult>
