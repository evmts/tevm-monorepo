import { callHandlerOpts } from './callHandlerOpts.js'
import { callHandlerResult } from './callHandlerResult.js'
import { validateCallParams } from '@tevm/zod'

/**
 * Creates an CallHandler for handling call params with Ethereumjs EVM
 * @param {import('@ethereumjs/evm').EVM} evm
 * @returns {import('@tevm/actions-spec').CallHandler}
 */
export const callHandler = (evm) => async (params) => {
	const errors = validateCallParams(params)
	if (errors.length > 0) {
		return { errors, executionGasUsed: 0n, rawData: '0x' }
	}

	try {
		const evmResult = await evm.runCall(callHandlerOpts(params))
		return callHandlerResult(evmResult)
	} catch (e) {
		return {
			errors: [
				{
					name: 'UnexpectedError',
					_tag: 'UnexpectedError',
					message:
						typeof e === 'string'
							? e
							: e instanceof Error
							? e.message
							: 'unknown error',
				},
			],
			executionGasUsed: 0n,
			rawData: '0x',
		}
	}
}
