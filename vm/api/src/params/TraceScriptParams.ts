import type { BlockTag, Hex } from 'viem'
import type { ScriptParams } from './ScriptParams.js'
import type { TraceParams } from './DebugParams.js'

// tevm_traceScript
/**
 * Params taken by `tevm_traceScript` handler
 * Tevm trace call is the same as eth_traceScript but with
 * some extra nice to have features and the call interface
 * nicely matches tevm_call interface.
 *
 * eth_traceScript uses tevm_call under the hood
 */
export type TraceScriptParams = TraceParams & {
  /**
   * The call to debug
   */
  readonly call: ScriptParams
  /**
   * Block information
   */
  readonly block?: BlockTag | Hex | bigint
}
