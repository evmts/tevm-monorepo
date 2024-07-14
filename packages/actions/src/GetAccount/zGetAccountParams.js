import { z } from 'zod'
import { zBaseParams } from '../BaseCall/zBaseParams.js'
import { zAddress } from '../internal/zod/zAddress.js'
import { zBlockParam } from '../internal/zod/zBlockParam.js'

/**
 * Zod validator for a valid getAccount action
 */
export const zGetAccountParams = zBaseParams
	.extend({
		address: zAddress,
		blockTag: zBlockParam.optional().describe('Block tag to execute call on. defaults to "latest"'),
		returnStorage: z
			.boolean()
			.optional()
			.describe('If true will return storage. Defaults to false. This can be expensive'),
	})
	.describe('Params to create an account or contract')
