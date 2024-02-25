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
	.refine(
		(params) => {
			if (params.createTransaction && params.stateOverrideSet) {
				return false
			}
			if (params.createTransaction && params.blockOverrideSet) {
				return false
			}
			return true
		},
		{
			message:
				'Cannot have stateOverrideSet or blockOverrideSet for createTransaction',
		},
	)
	.describe('Params to make a call to the tevm EVM')
