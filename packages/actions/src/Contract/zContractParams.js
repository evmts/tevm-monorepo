import { z } from 'zod'
import { zBaseCallParams } from '../BaseCall/zBaseCallParams.js'
import { zAbi } from '../internal/zod/zAbi.js'
import { zAddress } from '../internal/zod/zAddress.js'
import { zHex } from '../internal/zod/zHex.js'

/**
 * Zod validator for a valid contract action
 */
export const zContractParams = zBaseCallParams
	.extend({
		to: zAddress.optional().describe('The required address of the contract to call'),
		abi: zAbi.describe('The abi of the contract'),
		args: z.array(z.any()).optional().describe('The arguments to pass to the function'),
		functionName: z.string().describe('The name of the function to call'),
		code: zHex.optional().describe('the encoded bytecode to use for the call'),
	})
	.refine(
		(params) => {
			if (!params.code && !params.to) {
				return false
			}
			return true
		},
		{
			message: 'Must have either code or to',
		},
	)
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
			message: 'Cannot have stateOverrideSet or blockOverrideSet for createTransaction',
		},
	)
	.describe('Params to execute a contract method in the tevm EVM')
