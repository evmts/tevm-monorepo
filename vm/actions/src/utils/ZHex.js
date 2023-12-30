import { hexRegex } from './hexRegex.js'
import { z } from 'zod'

export const ZHex = z.string().transform((value, ctx) => {
	if (!hexRegex.test(value)) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: 'value must be a hex string',
		})
	}
	return /** @type {import('viem').Hex}*/ (value)
})
