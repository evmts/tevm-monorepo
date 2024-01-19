import { z } from 'zod'
import { zAddress } from '../index.js'

/**
 * Zod validator for a valid getAccount action
 */
export const zGetAccountParams = z
	.strictObject({ address: zAddress })
	.describe('Params to create an account or contract')
