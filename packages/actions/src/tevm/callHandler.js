import { callHandlerOpts } from './callHandlerOpts.js'
import { callHandlerResult } from './callHandlerResult.js'
import { validateCallParams } from '@tevm/zod'
import { throwOnErrorProxy } from './throwOnErrorProxy.js'

/**
 * Creates an CallHandler for handling call params with Ethereumjs EVM
 * @param {Pick<import('@tevm/base-client').BaseClient, 'vm'>} client
 * @returns {import('@tevm/actions-types').CallHandler}
 */
export const callHandler = (client) => throwOnErrorProxy(async (params) => {
	/**
	 * @type {import('@tevm/vm').TevmVm}
	 */
	let copiedVm

	try {
		copiedVm = params.createTransaction ? client.vm : await client.vm.deepCopy()
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
		if (params.createTransaction && !evmResult.execResult.exceptionError) {
			copiedVm.stateManager.checkpoint()
			copiedVm.stateManager.commit()
		}
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
})
