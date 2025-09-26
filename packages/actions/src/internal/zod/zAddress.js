// import { Address } from 'abitype/zod'
import { z } from 'zod'

// TODO: Somehow the type for Address here is broken, but we'll remove zod entirely
/**
 * Zod validator for a valid ethereum address
 */
export const zAddress = z.string().transform((val, ctx) => {
	const regex = /^0x[a-fA-F0-9]{40}$/

	if (!regex.test(val)) {
		ctx.addIssue({
			code: 'custom',
			message: `Invalid Address ${val}`,
		})
	}

	return val
}).describe('A valid ethereum address')
