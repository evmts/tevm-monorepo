import type { JsonRpcResponse } from 'viem'

/**
 * JSON-RPC response for `evm_setNextBlockTimestamp` method
 */
export type EvmSetNextBlockTimestampJsonRpcResponse = JsonRpcResponse<null, void, 'evm_setNextBlockTimestamp'>

/**
 * Union of all EVM JSON-RPC responses
 */
export type EvmJsonRpcResponse = EvmSetNextBlockTimestampJsonRpcResponse