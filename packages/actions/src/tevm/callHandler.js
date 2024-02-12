import { callHandlerOpts } from './callHandlerOpts.js'
import { callHandlerResult } from './callHandlerResult.js'
import { validateCallParams } from '@tevm/zod'

/**
 * Creates an CallHandler for handling call params with Ethereumjs EVM
 * @param {import('@tevm/vm').TevmVm} vm
 * @returns {import('@tevm/actions-types').CallHandler}
 */
export const callHandler = (vm) => async (params) => {
	/**
	 * @type {import('@ethereumjs/vm').VM}
	 */
	let copiedVm
	try {
		copiedVm = params.createTransaction ? vm : await vm.deepCopy()
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

	const validationErrors = validateCallParams(params)
	if (validationErrors.length > 0) {
		return { errors: validationErrors, executionGasUsed: 0n, rawData: '0x' }
	}

	try {
		const evmResult = await copiedVm.evm.runCall(callHandlerOpts(params))
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
