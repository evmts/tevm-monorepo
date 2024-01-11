import { zAbi } from '../common/zAbi.js'
import { zHex } from '../common/zHex.js'
import { zBaseCallParams } from './zBaseCallParams.js'
import { z } from 'zod'

/**
 * Zod validator for a valid script action
 */
export const zScriptParams = zBaseCallParams
	.extend({
		abi: zAbi.describe('The abi of the contract'),
		args: z
			.array(z.any())
			.optional()
			.describe('The arguments to pass to the function'),
		functionName: z.string().describe('The name of the function to call'),
		deployedBytecode: zHex.describe('The deployed bytecode of the contract'),
	})
	.describe('Params to run a script or contract')
