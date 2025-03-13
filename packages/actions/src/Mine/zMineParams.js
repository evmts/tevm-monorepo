import { z } from 'zod'
import { zBaseParams } from '../BaseCall/zBaseParams.js'

/**
 * Zod validator for a valid mine action invocation
 */
export const zMineParams = zBaseParams.extend({
	blockCount: z.number().int().gte(0).optional(),
	interval: z.number().int().gte(0).optional(),
	onBlock: z.function().optional(),
	onReceipt: z.function().optional(),
	onLog: z.function().optional(),
})
