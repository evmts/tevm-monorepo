import { zAddress, zBlock, zHex } from '../common/index.js'
import { z } from 'zod'

export const zBaseCallParams = z
	.object({
		skipBalance: z
			.boolean()
			.optional()
			.describe(
				'Set caller to msg.value of less than msg.value Defaults to false exceipt for when running scripts where it is set to true',
			),
		gasRefund: z.bigint().optional().describe('Refund counter. Defaults to 0'),
		block: zBlock
			.partial()
			.optional()
			.describe(
				'The `block` the `tx` belongs to. If omitted a default blank block will be used.',
			),
		gas: z
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
		gasLimit: z
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
