import { z } from 'zod'
import { zBaseParams } from '../BaseCall/zBaseParams.js'
import { zAddress } from '../internal/zod/zAddress.js'

/**
 * Zod validator for a valid getAccount action
 */
export const zGetAccountParams = zBaseParams
	.extend({
		address: zAddress,
		returnStorage: z
			.boolean()
			.optional()
			.describe('If true will return storage. Defaults to false. This can be expensive'),
	})
	.describe('Params to create an account or contract')
