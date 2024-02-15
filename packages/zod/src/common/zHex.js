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

/**
 * Copied from https://ethereum.github.io/execution-apis/api-documentation/
 */
const strictHex = /^0x([1-9a-f]+[0-9a-f]*|0)$/

/**
 * Hex strings returned by the Ethereum JSON-RPC API
 */
export const zStrictHex = z.string().transform((value, ctx) => {
	if (!strictHex.test(value)) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: 'value must be a hex string',
		})
	}
	return /** @type {import('@tevm/utils').Hex}*/ (value)
})
