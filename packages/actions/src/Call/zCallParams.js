// Imported but not used in the code directly
// @ts-ignore
import { z } from 'zod'
import { zBaseCallParams } from '../BaseCall/zBaseCallParams.js'
import { zHex } from '../internal/zod/zHex.js'

/**
 * @internal
 * Zod validator for a valid call action
 */
export const zCallParams = z
	.intersection(
		zBaseCallParams,
		z.object({
			data: zHex.optional().describe('the data to send'),
			salt: zHex.optional().describe('the salt to use for the call'),
			code: zHex.optional().describe('the encoded deployment code to use for the call'),
			deployedBytecode: zHex
				.optional()
				.describe('the deployed bytecode to put into state. Use code if you want to encode the deployment code'),
		}),
	)
	.refine(
		(/** @type {any} */ params) => {
			if (params.code && params.deployedBytecode) {
				return false
			}
			return true
		},
		{ message: 'Cannot have both code and deployedBytecode set' },
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
	.describe('Params to make a call to the tevm EVM')
