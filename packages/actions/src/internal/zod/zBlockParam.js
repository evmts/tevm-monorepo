import { z } from 'zod'
import { zHex } from './zHex.js'

export const zBlockParam = z.union([
	z.literal('latest'),
	z.literal('earliest'),
	z.literal('pending'),
	z.literal('safe'),
	z.literal('finalized'),
	z.bigint(),
	z.number().transform((n) => BigInt(n)), // Add number support with transformation
	zHex,
])
