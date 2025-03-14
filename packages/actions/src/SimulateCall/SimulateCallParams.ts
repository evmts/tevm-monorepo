import type { CallParams } from '../Call/CallParams.js'

/**
 * Parameters for the {@link simulateCallHandler}
 *
 * Used to simulate a call transaction in the context of a specific block, with the option
 * to simulate after specific transactions in the block.
 */
export type SimulateCallParams = {
	/**
	 * Block tag to simulate on ('latest', 'earliest', 'pending', 'safe', 'finalized')
	 */
	blockTag?: string
	/**
	 * Block number to simulate on
	 */
	blockNumber?: number | bigint
	/**
	 * Block hash to simulate on
	 */
	blockHash?: `0x${string}`
	/**
	 * Transaction index in the block to simulate after (optional)
	 * If provided, will simulate after this transaction
	 */
	transactionIndex?: number | bigint
	/**
	 * Transaction hash in the block to simulate
	 * If provided, will override the transaction with the given parameters
	 */
	transactionHash?: `0x${string}`
	/**
	 * Transaction parameters for the simulation
	 * Will be merged with transactionHash if provided
	 */
} & Partial<CallParams>
