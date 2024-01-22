import { zAbi, zAddress } from '../common/index.js'
import { zBaseCallParams } from './zBaseCallParams.js'
import { z } from 'zod'

/**
 * Zod validator for a valid contract action
 */
export const zContractParams = zBaseCallParams
	.extend({
		to: zAddress.describe('The required address of the contract to call'),
		abi: zAbi.describe('The abi of the contract'),
		args: z
			.array(z.any())
			.optional()
			.describe('The arguments to pass to the function'),
		functionName: z.string().describe('The name of the function to call'),
	})
	.describe('Params to execute a contract method in the tevm EVM')
