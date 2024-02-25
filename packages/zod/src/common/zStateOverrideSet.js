import { zAddress } from './zAddress.js'
import { zHex } from './zHex.js'
import { z } from 'zod'

export const zStateOverrideSet = z.record(
	zAddress,
	z.strictObject({
		balance: z.bigint().gte(0n).optional(),
		nonce: z.bigint().gte(0n).optional(),
		code: zHex.optional(),
		state: z.record(zHex, zHex).optional(),
		stateDiff: z.record(zHex, zHex).optional(),
	}),
)
