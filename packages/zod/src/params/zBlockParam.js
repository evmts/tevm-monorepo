import { zHex } from '../common/index.js'
import { z } from 'zod'

export const zBlockParam = z.union([
	z.literal('latest'),
	z.literal('earliest'),
	z.literal('pending'),
	z.literal('safe'),
	z.literal('finalized'),
	z.bigint(),
	zHex,
])
