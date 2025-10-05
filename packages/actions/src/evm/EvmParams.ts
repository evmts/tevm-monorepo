import type { Quantity } from 'viem'

/**
 * Parameters for `evm_setNextBlockTimestamp` method
 */
export type EvmSetNextBlockTimestampParams = readonly [timestamp: Quantity]

/**
 * Union of all EVM method parameters
 */
export type EvmParams = {
	evm_setNextBlockTimestamp: EvmSetNextBlockTimestampParams
}