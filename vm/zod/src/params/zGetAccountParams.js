import { z } from 'zod'

/**
 * Zod validator for a valid getAccount action
 */
export const zGetAccountParams = z
	.strictObject({})
	.describe('Params to create an account or contract')
