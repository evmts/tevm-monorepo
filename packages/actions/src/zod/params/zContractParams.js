import { z } from 'zod'
import { zAbi, zAddress } from '../common/index.js'
import { zBaseCallParams } from './zBaseCallParams.js'

/**
 * Zod validator for a valid contract action
 */
export const zContractParams = zBaseCallParams
	.extend({
		to: zAddress.describe('The required address of the contract to call'),
		abi: zAbi.describe('The abi of the contract'),
		args: z.array(z.any()).optional().describe('The arguments to pass to the function'),
		functionName: z.string().describe('The name of the function to call'),
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
			message: 'Cannot have stateOverrideSet or blockOverrideSet for createTransaction',
		},
	)
	.describe('Params to execute a contract method in the tevm EVM')
