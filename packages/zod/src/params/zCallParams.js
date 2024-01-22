import { zHex } from '../common/index.js'
import { zBaseCallParams } from './zBaseCallParams.js'

/**
 * Zod validator for a valid call action
 */
export const zCallParams = zBaseCallParams
	.extend({
		data: zHex.optional().describe('the data to send'),
		salt: zHex.optional().describe('the salt to use for the call'),
		deployedBytecode: zHex
			.optional()
			.describe('the deployed bytecode to use for the call'),
	})
	.describe('Params to make a call to the tevm EVM')
