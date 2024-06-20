import { InternalError } from '@tevm/errors'
import { EthjsAddress } from '@tevm/utils'
import { numberToBytes } from 'viem'
import { createScript } from '../Contract/createScript.js'
import { createTransaction } from '../CreateTransaction/createTransaction.js'
import { getL1FeeInformationOpStack } from '../internal/getL1FeeInformationOpStack.js'
import { maybeThrowOnFail } from '../internal/maybeThrowOnFail.js'
import { callHandlerOpts } from './callHandlerOpts.js'
import { callHandlerResult } from './callHandlerResult.js'
import { cloneVmWithBlockTag } from './cloneVmWithBlock.js'
import { executeCall } from './executeCall.js'
import { handleAutomining } from './handleAutomining.js'
import { shouldCreateTransaction } from './shouldCreateTransaction.js'
import { validateCallParams } from './validateCallParams.js'

/**
 * Creates a code splitable instance of [`client.tevmCall`](https://tevm.sh/reference/tevm/decorators/type-aliases/tevmactionsapi/#call) action
 * @param {import('@tevm/base-client').BaseClient} client
 * @param {object} [options]
 * @param {boolean} [options.throwOnFail]
 * @returns {import('./CallHandlerType.js').CallHandler}
 * @throws {import('./TevmCallError.js').TevmCallError} if throwOnFail is true returns TevmCallError as value
 * @example
 * ```typescript
 * import { createBaseClient } from 'tevm/base-client'
 * import { callHandler } from 'tevm/actions'
 *
 * const client = createBaseClient()
 *
 * const call = callHandler(client)
 *
 * const res = await call({
 *   createTransaction: true,
 *   to: `0x${'69'.repeat(20)}`,
 *   value: 420n,
 *   skipBalance: true,
 * })
 * ```
 */
export const callHandler =
	(client, { throwOnFail: defaultThrowOnFail = true } = {}) =>
	async ({ code, deployedBytecode, ...params }) => {
		/**
		 * ***************
		 * 0 VALIDATE PARAMS
		 * ***************
		 */
		client.logger.debug(params, 'callHandler: Executing call with params')
		const validationErrors = validateCallParams(params)
		if (validationErrors.length > 0) {
			client.logger.debug(validationErrors, 'Params do not pass validation')
			return maybeThrowOnFail(params.throwOnFail ?? defaultThrowOnFail, {
				errors: validationErrors,
				executionGasUsed: 0n,
				/**
				 * @type {`0x${string}`}
				 */
				rawData: '0x',
			})
		}
		const _params = {
			...params,
		}

		const { errors, data: evmInput } = await callHandlerOpts(client, _params)
		if (errors) {
			client.logger.error(errors ?? evmInput, 'callHandler: Unexpected error converting params to ethereumjs params')
			return maybeThrowOnFail(_params.throwOnFail ?? defaultThrowOnFail, {
				errors,
				executionGasUsed: 0n,
				rawData: /** utype {`0x${string}`}*/ '0x',
			})
		}

		const block = /** @type {import('@tevm/block').Block}*/ (evmInput?.block)
		// this will never happen the type is wrong internally
		if (!block) {
			throw new InternalError(
				'UnexpectedError: Internal block header does not have a state root. This potentially indicates a bug in tevm',
			)
		}
		/**
		 * ************
		 * 1 CLONE THE VM WITH BLOCK TAG
		 * ************
		 */
		const vm = await cloneVmWithBlockTag(client, block)
		if ('errors' in vm) {
			client.logger.error(vm.errors, 'contractHandler: Errors cloning vm')
			return maybeThrowOnFail(_params.throwOnFail ?? defaultThrowOnFail, {
				errors: vm.errors,
				executionGasUsed: 0n,
				rawData: '0x',
			})
		}

		const scriptResult =
			code || deployedBytecode
				? await createScript({ ...client, getVm: () => vm.ready().then(() => vm) }, code, deployedBytecode, _params.to)
				: { address: _params.to, errors: undefined }
		if (scriptResult.errors) {
			client.logger.error(scriptResult.errors, 'contractHandler: Errors creating script')
			return maybeThrowOnFail(_params.throwOnFail ?? defaultThrowOnFail, {
				errors: scriptResult.errors,
				executionGasUsed: 0n,
				rawData: '0x',
			})
		}

		if (scriptResult.address !== undefined) {
			// TODO this isn't clean that we are mutating here
			evmInput.to = EthjsAddress.fromString(scriptResult.address)
			_params.to = scriptResult.address
		}

		// start getting opstack information right away in parallel
		const l1FeeInfoPromise =
			vm.common.sourceId !== undefined
				? getL1FeeInformationOpStack(evmInput.data ?? numberToBytes(0), vm).catch((e) => {
						client.logger.warn(e, 'Unable to get l1 fee estimation')
						return {}
					})
				: Promise.resolve({})

		/**
		 * ************
		 * 2 RUN THE EVM
		 * ************
		 */
		client.logger.debug(
			{
				to: evmInput.to?.toString(),
				origin: evmInput.origin?.toString(),
				caller: evmInput.caller?.toString(),
				value: evmInput.value?.toString(),
				gasLimit: evmInput.gasLimit?.toString(),
				data: evmInput.data,
			},
			'callHandler: Executing runCall with params',
		)
		const executedCall = await executeCall({ ...client, getVm: () => Promise.resolve(vm) }, evmInput, _params)
		if ('errors' in executedCall) {
			return maybeThrowOnFail(_params.throwOnFail ?? defaultThrowOnFail, {
				executionGasUsed: 0n,
				/**
				 * @type {`0x${string}`}
				 */
				rawData: '0x',
				...executedCall,
			})
		}

		/**
		 * ****************************
		 * 3 CREATE TRANSACTION WITH CALL (if neessary)
		 * ****************************
		 */
		/**
		 * @type {import('@tevm/utils').Hex | undefined}
		 */
		let txHash = undefined
		if (shouldCreateTransaction(_params, executedCall.runTxResult)) {
			const txRes = await createTransaction(client)({
				throwOnFail: false,
				evmOutput: executedCall.runTxResult,
				evmInput,
				maxPriorityFeePerGas: _params.maxPriorityFeePerGas,
				maxFeePerGas: _params.maxFeePerGas,
			})
			txHash = 'txHash' in txRes ? txRes.txHash : undefined
			if ('errors' in txRes && txRes.errors.length) {
				return /** @type {any}*/ (
					maybeThrowOnFail(_params.throwOnFail ?? defaultThrowOnFail, {
						...('errors' in txRes ? { errors: txRes.errors } : {}),
						...(vm.common.sourceId !== undefined ? await l1FeeInfoPromise : {}),
						...callHandlerResult(executedCall.runTxResult, undefined, executedCall.trace, executedCall.accessList),
					})
				)
			}
			client.logger.debug(txHash, 'Transaction successfully added')

			const miningRes = (await handleAutomining(client, txHash)) ?? {}
			if ('errors' in miningRes) {
				return maybeThrowOnFail(_params.throwOnFail ?? defaultThrowOnFail, {
					...('errors' in miningRes ? { errors: miningRes.errors } : {}),
					...(vm.common.sourceId !== undefined ? await l1FeeInfoPromise : {}),
					...callHandlerResult(executedCall.runTxResult, txHash, executedCall.trace, executedCall.accessList),
				})
			}
		}

		/**
		 * ******************
		 * 4 RETURN CALL RESULT
		 * ******************
		 */
		return maybeThrowOnFail(_params.throwOnFail ?? defaultThrowOnFail, {
			...(vm.common.sourceId !== undefined ? await l1FeeInfoPromise : {}),
			...callHandlerResult(executedCall.runTxResult, txHash, executedCall.trace, executedCall.accessList),
		})
	}
