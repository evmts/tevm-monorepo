/**
 * @module zSimulateCallItem
 * Zod schema for call items in simulateCalls requests
 */

import { z } from 'zod'
import { zAddress } from '../zod/zAddress.js'
import { zHex } from '../zod/zHex.js'

/**
 * Zod schema for call items in simulateCalls requests
 * @type {import('zod').ZodSchema<import('../../../types/SimulateCallItem.js').SimulateCallItem>}
 */
export const zSimulateCallItem = z
	.object({
		from: zAddress.optional(),
		to: zAddress.optional(),
		data: zHex.optional(),
		gas: z.bigint().optional(),
		gasPrice: z.bigint().optional(),
		maxFeePerGas: z.bigint().optional(),
		maxPriorityFeePerGas: z.bigint().optional(),
		value: z.bigint().optional(),
		nonce: z.number().optional(),
		accessList: z
			.array(
				z.object({
					address: zAddress,
					storageKeys: z.array(zHex),
				}),
			)
			.optional(),
		abi: z.any().optional(),
		functionName: z.string().optional(),
		args: z.array(z.any()).optional(),
	})
	.refine(
		(data) => {
			// If abi and functionName are provided, we need a `to` address
			if (data.abi && data.functionName && !data.to) {
				return false
			}
			return true
		},
		{
			message: 'When providing abi and functionName, a to address is required',
			path: ['to'],
		},
	)
