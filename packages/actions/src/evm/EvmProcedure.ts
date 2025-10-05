import type { EvmSetNextBlockTimestampJsonRpcRequest, EvmSetNextBlockTimestampJsonRpcResponse } from '.'

/**
 * Procedure type for `evm_setNextBlockTimestamp` method
 */
export type EvmSetNextBlockTimestampProcedure = (
	request: EvmSetNextBlockTimestampJsonRpcRequest,
) => Promise<EvmSetNextBlockTimestampJsonRpcResponse>

/**
 * Union of all EVM procedure types
 */
export type EvmProcedure = {
	evm_setNextBlockTimestamp: EvmSetNextBlockTimestampProcedure
}