import { callHandlerOpts } from './callHandlerOpts.js'
import { callHandlerResult } from './callHandlerResult.js'
import { maybeThrowOnFail } from './maybeThrowOnFail.js'
import { validateCallParams } from '@tevm/zod'

/**
 * Creates an CallHandler for handling call params with Ethereumjs EVM
 * @param {Pick<import('@tevm/base-client').BaseClient, 'getVm'>} client
 * @param {object} [options]
 * @param {boolean} [options.throwOnFail]
 * @returns {import('@tevm/actions-types').CallHandler}
 */
export const callHandler =
	(client, { throwOnFail: defaultThrowOnFail = true } = {}) =>
	async (params) => {
		/**
		 * @type {import('@tevm/vm').TevmVm}
		 */
		let copiedVm

		const vm = await client.getVm()

		try {
			copiedVm = params.createTransaction ? vm : await vm.deepCopy()
		} catch (e) {
			return maybeThrowOnFail(params.throwOnFail ?? defaultThrowOnFail, {
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
			})
		}

		const validationErrors = validateCallParams(params)
		if (validationErrors.length > 0) {
			return maybeThrowOnFail(params.throwOnFail ?? defaultThrowOnFail, {
				errors: validationErrors,
				executionGasUsed: 0n,
				/**
				 * @type {`0x${string}`}
				 */
				rawData: '0x',
			})
		}

		try {
			const { errors, data: opts } = await callHandlerOpts(client, params)
			if (errors ?? !opts) {
				return maybeThrowOnFail(params.throwOnFail ?? defaultThrowOnFail, {
					errors: /** @type {import('@tevm/errors').CallError[]}*/ (errors),
					executionGasUsed: 0n,
					/**
					 * @type {`0x${string}`}
					 */
					rawData: '0x',
				})
			}
			const evmResult = await copiedVm.evm.runCall(opts)
			if (params.createTransaction && !evmResult.execResult.exceptionError) {
				copiedVm.stateManager.checkpoint()
				copiedVm.stateManager.commit()
			}
			return /** @type {any}*/ (
				maybeThrowOnFail(
					params.throwOnFail ?? defaultThrowOnFail,
					callHandlerResult(evmResult),
				)
			)
		} catch (e) {
			console.error('not good', e)
			return maybeThrowOnFail(params.throwOnFail ?? defaultThrowOnFail, {
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
				/**
				 * @type {`0x${string}`}
				 */
				rawData: '0x',
			})
		}
	}
