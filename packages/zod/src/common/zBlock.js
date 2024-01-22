import { zAddress } from './zAddress.js'
import { z } from 'zod'

/**
 * Zod validator for a block header specification within actions
 */
export const zBlock = z
	.strictObject({
		number: z
			.bigint()
			.min(0n)
			.describe('The block number (height) in the blockchain.'),
		coinbase: zAddress.describe(
			'The address of the miner or validator who mined or validated the block.',
		),
		timestamp: z
			.bigint()
			.min(0n)
			.describe('The timestamp at which the block was mined or validated.'),
		difficulty: z
			.bigint()
			.min(0n)
			.describe('The difficulty level of the block (relevant in PoW chains).'),
		gasLimit: z
			.bigint()
			.min(0n)
			.describe(
				'The gas limit for the block, i.e., the maximum amount of gas that can be used by the transactions in the block.',
			),
		baseFeePerGas: z
			.bigint()
			.min(0n)
			.optional()
			.describe(
				'(Optional) The base fee per gas in the block, introduced in EIP-1559 for dynamic transaction fee calculation.',
			),
		blobGasPrice: z
			.bigint()
			.min(0n)
			.optional()
			.describe(
				'The gas price for the block; may be undefined in blocks after EIP-1559.',
			),
	})
	.describe('A valid block header')
