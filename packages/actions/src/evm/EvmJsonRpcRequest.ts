import type { Quantity } from 'viem'
import type { JsonRpcRequest } from 'viem'

/**
 * JSON-RPC request for `evm_setNextBlockTimestamp` method
 */
export type EvmSetNextBlockTimestampJsonRpcRequest = JsonRpcRequest<
	'evm_setNextBlockTimestamp',
	readonly [timestamp: Quantity]
>

/**
 * Union of all EVM JSON-RPC requests
 */
export type EvmJsonRpcRequest = EvmSetNextBlockTimestampJsonRpcRequest