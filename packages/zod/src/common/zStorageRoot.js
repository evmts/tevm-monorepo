import { z } from 'zod'

const storageRootRegex = /^0x[0-9a-fA-F]{64}$/

/**
 * Zod validator for valid ethereum storage root
 */
export const zStorageRoot = z
	.string()
	.transform((value, ctx) => {
		if (!storageRootRegex.test(value)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message:
					'Value must be a 32-byte hex string (64 hex characters with a 0x prefix)',
			})
		}
		return value
	})
	.describe('Valid ethereum storage root')
