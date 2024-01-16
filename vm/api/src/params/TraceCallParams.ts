import type { BlockTag, Hex } from 'viem'
import type { CallParams } from './CallParams.js'
import type { TraceParams } from './DebugParams.js'

// tevm_traceCall
/**
 * Params taken by `tevm_traceCall` handler
 * Tevm trace call is the same as eth_traceCall but with
 * some extra nice to have features and the call interface
 * nicely matches tevm_call interface.
 *
 * eth_traceCall uses tevm_call under the hood
 */
export type TraceCallParams = TraceParams & {
  /**
   * The call to debug
   */
  readonly call: CallParams
  /**
   * Block information
   */
  readonly block?: BlockTag | Hex | bigint
}
