import { type Hex } from 'viem'
import { z } from 'zod'
import { hexRegex } from './hexRegex.js'

export const ZHex = z.string().transform((value, ctx) => {
	if (!hexRegex.test(value)) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: 'value must be a hex string',
		})
	}
	return value as Hex
})
