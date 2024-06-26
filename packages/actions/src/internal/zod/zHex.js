import { z } from 'zod'

export const hexRegex = /^0x[0-9a-fA-F]*$/

/**
 * Zod validator for a valid hex string
 */
export const zHex = z
	.string()
	.transform((value, ctx) => {
		if (!hexRegex.test(value)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'value must be a hex string',
			})
		}
		return /** @type {import('@tevm/utils').Hex}*/ (value)
	})
	.describe('A hex string')
