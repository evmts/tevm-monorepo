import type { Address } from './Address.js'

/**
 * Header information of an ethereum block
 */
export type Block = {
	/**
	 * The block number (height) in the blockchain.
	 */
	readonly number: bigint

	/**
	 * The address of the miner or validator who mined or validated the block.
	 */
	readonly coinbase: Address

	/**
	 * The timestamp at which the block was mined or validated.
	 */
	readonly timestamp: bigint

	/**
	 * The difficulty level of the block (relevant in PoW chains).
	 */
	readonly difficulty: bigint

	/**
	 * The gas limit for the block, i.e., the maximum amount of gas that can be used by the transactions in the block.
	 */
	readonly gasLimit: bigint

	/**
	 * (Optional) The base fee per gas in the block, introduced in EIP-1559 for dynamic transaction fee calculation.
	 */
	readonly baseFeePerGas?: bigint

	/**
	 * The gas price for the block; may be undefined in blocks after EIP-1559.
	 */
	readonly blobGasPrice?: bigint
}
