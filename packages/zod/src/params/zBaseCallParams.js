import { zAddress, zHex } from '../common/index.js'
import { zBaseParams } from './zBaseParams.js'
import { zBlockParam } from './zBlockParam.js'
import { z } from 'zod'

export const zBaseCallParams = zBaseParams
	.extend({
		createTransaction: z
			.boolean()
			.optional()
			.describe(
				'If true, this call is a create transaction. Defaults to false.',
			),
		skipBalance: z
			.boolean()
			.optional()
			.describe(
				'Set caller to msg.value of less than msg.value Defaults to false.',
			),
		gasRefund: z.bigint().optional().describe('Refund counter. Defaults to 0'),
		blockTag: zBlockParam
			.optional()
			.describe(
				'The block tag as a block number, block hash or one of "latest", "earliest", "pending" or "safe"',
			),
		gasPrice: z
			.bigint()
			.optional()
			.describe('The gas price for the call. Defaults to `0`'),
		origin: zAddress
			.optional()
			.describe(
				'The address where the call originated from. Defaults to the zero address.',
			),
		caller: zAddress
			.optional()
			.describe(
				'The address that ran this code (`msg.sender`). Defaults to the zero address.',
			),
		gas: z
			.bigint()
			.optional()
			.describe(
				'The gas limit for the call. Defaults to `16777215` (`0xffffff`)',
			),
		value: z
			.bigint()
			.optional()
			.describe(
				'The value in ether that is being sent to `opts.address`. Defaults to `0`',
			),
		depth: z.number().optional().describe('The call depth. Defaults to `0`'),
		selfdestruct: z
			.set(zAddress)
			.optional()
			.describe('Addresses to selfdestruct. Defaults to the empty set.'),
		to: zAddress
			.optional()
			.describe(
				'The address of the account that is executing this code (`address(this)`). Defaults to the zero address.',
			),
		blobVersionedHashes: z
			.array(zHex)
			.optional()
			.describe('Versioned hashes for each blob in a blob transaction'),
	})
	.describe('Properties shared across call-like actions')
