import type { Quantity } from 'viem'

/**
 * EVM handler for `evm_setNextBlockTimestamp` method
 */
export type EvmSetNextBlockTimestampHandler = (
	params: readonly [timestamp: Quantity],
) => Promise<{ errors?: never } | { errors: Error[] }>

/**
 * Mapping of `evm_*` method names to their respective handlers
 */
export type EvmHandler = {
	evm_setNextBlockTimestamp: EvmSetNextBlockTimestampHandler
}