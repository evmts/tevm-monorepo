import type { Hex } from 'viem'
import { z } from 'zod'

const hexRegex = /^0x[0-9a-fA-F]*$/
export const ZHex = z.string().transform((value, ctx) => {
	if (!hexRegex.test(value)) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: 'value must be a hex string',
		})
	}
	return value as Hex
})
