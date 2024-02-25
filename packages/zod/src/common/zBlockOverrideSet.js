import { zAddress } from './zAddress.js'
import { z } from 'zod'

export const zBlockOverrideSet = z.strictObject({
	number: z.bigint().gte(0n).optional(),
	time: z.bigint().gte(0n).optional(),
	gasLimit: z.bigint().gte(0n).optional(),
	coinbase: zAddress.optional(),
	baseFee: z.bigint().gte(0n).optional(),
	blobBaseFee: z.bigint().gte(0n).optional(),
})
