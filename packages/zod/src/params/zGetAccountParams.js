import { zAddress } from '../index.js'
import { zBaseParams } from './zBaseParams.js'

/**
 * Zod validator for a valid getAccount action
 */
export const zGetAccountParams = zBaseParams
	.extend({ address: zAddress })
	.describe('Params to create an account or contract')
