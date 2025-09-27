// Imported but not used in the code directly
import { z } from 'zod'
import { zBaseCallParams } from '../BaseCall/zBaseCallParams.js'
import { zAbi } from '../internal/zod/zAbi.js'
import { zAddress } from '../internal/zod/zAddress.js'
import { zHex } from '../internal/zod/zHex.js'

/**
 * Zod validator for a valid contract action
 */
export const zContractParams = z
	.intersection(
		zBaseCallParams,
		z.object({
			to: zAddress.optional().describe('The required address of the contract to call'),
			abi: zAbi.describe('The abi of the contract'),
			args: z.array(z.any()).optional().describe('The arguments to pass to the function'),
			functionName: z.string().describe('The name of the function to call'),
			code: zHex.optional().describe('the encoded bytecode to use for the call'),
			deployedBytecode: zHex
				.optional()
				.describe(
					'deployed bytecode to put into state for contract. If you want to run a constructor use code instead',
				),
		}),
	)
	.refine(
		(/** @type {any} */ params) => {
			if (!params.code && !params.to && !params.deployedBytecode) {
				return false
			}
			return true
		},
		{
			message: 'Must have either code or to',
		},
	)
	.refine(
		(/** @type {any} */ params) => {
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
