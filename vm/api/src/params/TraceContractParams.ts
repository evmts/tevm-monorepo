import type { BlockTag, Hex } from 'viem'
import type { ContractParams } from './ContractParams.js'
import type { TraceParams } from './DebugParams.js'

// tevm_traceContract
/**
 * Params taken by `tevm_traceContract` handler
 * Tevm trace call is the same as eth_traceContract but with
 * some extra nice to have features and the call interface
 * nicely matches tevm_call interface.
 *
 * eth_traceContract uses tevm_call under the hood
 */
export type TraceContractParams = TraceParams & {
  /**
   * The call to debug
   */
  readonly call: ContractParams
  /**
   * Block information
   */
  readonly block?: BlockTag | Hex | bigint
}
