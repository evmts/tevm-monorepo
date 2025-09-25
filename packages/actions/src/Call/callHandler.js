import { createAddress } from '@tevm/address'
import { numberToBytes } from 'viem'
import { createScript } from '../Contract/createScript.js'
import { getL1FeeInformationOpStack } from '../internal/getL1FeeInformationOpStack.js'
import { getPendingClient } from '../internal/getPendingClient.js'
import { maybeThrowOnFail } from '../internal/maybeThrowOnFail.js'
import { callHandlerOpts } from './callHandlerOpts.js'
import { callHandlerResult } from './callHandlerResult.js'
import { cloneVmWithBlockTag } from './cloneVmWithBlock.js'
import { executeCall } from './executeCall.js'
import { handlePendingTransactionsWarning } from './handlePendingTransactionsWarning.js'
import { handleStateOverrides } from './handleStateOverrides.js'
import { handleTransactionCreation } from './handleTransactionCreation.js'
import { validateCallParams } from './validateCallParams.js'

/**
 * Creates a tree-shakable instance of [`client.tevmCall`](https://tevm.sh/reference/tevm/decorators/type-aliases/tevmactionsapi/#call) action.
 * This function is designed for use with TevmNode and the internal instance of TEVM,
 * and it is distinct from the viem API `tevmCall`.
 *
 * Note: This is the internal logic used by higher-level APIs such as `tevmCall`.
 *
 * @param {import('@tevm/node').TevmNode} client - The TEVM base client instance.
 * @param {object} [options] - Optional parameters.
 * @param {boolean} [options.throwOnFail=true] - Whether to throw an error on failure.
 * @returns {import('./CallHandlerType.js').CallHandler} The call handler function.
 * @throws {import('./TevmCallError.js').TevmCallError} If `throwOnFail` is true, returns `TevmCallError` as value.
 *
 * @example
 * ```typescript
 * import { createTevmNode } from 'tevm/node'
 * import { callHandler } from 'tevm/actions'
 *
 * const client = createTevmNode()
 *
 * const call = callHandler(client)
 *
 * // Add transaction to mempool (requires mining later)
 * const res = await call({
 *   addToMempool: true,
 *   to: `0x${'69'.repeat(20)}`,
 *   value: 420n,
 *   skipBalance: true,
 * })
 * await client.tevmMine()
 *
 * // Or add transaction to blockchain directly (automatically mines)
 * const autoMinedRes = await call({
 *   addToBlockchain: true,
 *   to: `0x${'69'.repeat(20)}`,
 *   value: 420n,
 *   skipBalance: true,
 * })
 * ```
 */
export const callHandler =
	(client, { throwOnFail: defaultThrowOnFail = true } = {}) =>
	async ({ code, deployedBytecode, onStep, onNewContract, onBeforeMessage, onAfterMessage, ...params }) => {
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

		if (_params.blockTag === 'pending') {
			const minePending = await getPendingClient(client)
			if (minePending.errors) {
				client.logger.error(minePending.errors)
				return maybeThrowOnFail(_params.throwOnFail ?? defaultThrowOnFail, {
					errors: minePending.errors,
					executionGasUsed: 0n,
					/**
					 * @type {`0x${string}`}
					 */
					rawData: '0x',
				})
			}
			// if we are creating a transaction we want to use the real txpool so the tx gets properly added
			if (
				_params.createTransaction ||
				_params.addToMempool ||
				_params.addToBlockchain ||
				client.miningConfig.type === 'auto'
			) {
				const pendingClientAny = /** @type {any}*/ (minePending.pendingClient)
				pendingClientAny.getTxPool = client.getTxPool
			}
			return callHandler(minePending.pendingClient, {
				throwOnFail: defaultThrowOnFail,
			})({
				...(code !== undefined ? { code } : {}),
				...(deployedBytecode !== undefined ? { deployedBytecode } : {}),
				..._params,
				blockTag: 'latest',
			})
		}

		const callHandlerRes = await callHandlerOpts(client, _params)
		if (callHandlerRes.errors) {
			return maybeThrowOnFail(_params.throwOnFail ?? defaultThrowOnFail, {
				errors: callHandlerRes.errors,
				executionGasUsed: 0n,
				rawData: /** @type {`0x${string}`}*/ ('0x'),
			})
		}

		const evmInput = callHandlerRes.data

		const block = /** @type {import('@tevm/block').Block}*/ (evmInput.block)

		await handlePendingTransactionsWarning(client, params, code, deployedBytecode)

		const vm = await cloneVmWithBlockTag(client, block)
		if (vm instanceof Error) {
			return maybeThrowOnFail(_params.throwOnFail ?? defaultThrowOnFail, {
				errors: [vm],
				executionGasUsed: 0n,
				/**
				 * @type {`0x${string}`}
				 */
				rawData: '0x',
			})
		}

		const stateOverrideResult = await handleStateOverrides(
			{ ...client, getVm: async () => vm },
			params.stateOverrideSet,
		)
		if (stateOverrideResult.errors) {
			return maybeThrowOnFail(_params.throwOnFail ?? defaultThrowOnFail, {
				errors: stateOverrideResult.errors,
				executionGasUsed: 0n,
				/**
				 * @type {`0x${string}`}
				 */
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
				// TODO type errors better in callHandler
				errors: /** @type {any}*/ (scriptResult.errors),
				executionGasUsed: 0n,
				/**
				 * @type {`0x${string}`}
				 */
				rawData: '0x',
			})
		}

		if (scriptResult.address !== undefined) {
			// TODO this isn't clean that we are mutating here
			evmInput.to = createAddress(scriptResult.address)
			_params.to = scriptResult.address
		}

		const l1FeeInfoPromise =
			vm.common.sourceId !== undefined
				? getL1FeeInformationOpStack(evmInput.data ?? numberToBytes(0), vm).catch((e) => {
						client.logger.warn(e, 'Unable to get l1 fee estimation')
						return {}
					})
				: Promise.resolve({})

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

		// Extract event handlers from original params to pass to executeCall
		// Only include event handlers that are defined to match CallEvents type
		/** @type {import('../common/CallEvents.js').CallEvents} */
		const eventHandlers = {}
		if (onStep) eventHandlers.onStep = onStep
		if (onNewContract) eventHandlers.onNewContract = onNewContract
		if (onBeforeMessage) eventHandlers.onBeforeMessage = onBeforeMessage
		if (onAfterMessage) eventHandlers.onAfterMessage = onAfterMessage
		const executedCall = await executeCall(
			{ ...client, getVm: () => Promise.resolve(vm) },
			evmInput,
			_params,
			eventHandlers,
		)

		// In such case executeCall failed to execute the transaction and threw an unrecoverable error
		if (!('runTxResult' in executedCall)) {
			return maybeThrowOnFail(_params.throwOnFail ?? defaultThrowOnFail, {
				executionGasUsed: /** @type {any}*/ 0n, // transaction was not executed
				rawData: /** @type {`0x${string}`}*/ ('0x'),
				errors: executedCall.errors,
				...('trace' in executedCall && executedCall.trace !== undefined ? { trace: executedCall.trace } : {}),
			})
		}

		// If there is a result, the errors will be runtime evm errors and we might want to still include the transaction
		const txResult = await handleTransactionCreation(client, params, executedCall, evmInput)

		// Normal path for execution errors (e.g. revert)
		if ('runTxResult' in executedCall && (executedCall.errors || txResult.errors)) {
			return maybeThrowOnFail(_params.throwOnFail ?? defaultThrowOnFail, {
				...(vm.common.sourceId !== undefined ? await l1FeeInfoPromise : {}),
				...callHandlerResult(executedCall.runTxResult, txResult.hash, executedCall.trace, executedCall.accessList),
				errors: /** @type {any}*/ (executedCall.errors ?? txResult.errors),
			})
		}

		return maybeThrowOnFail(_params.throwOnFail ?? defaultThrowOnFail, {
			...(vm.common.sourceId !== undefined ? await l1FeeInfoPromise : {}),
			...callHandlerResult(executedCall.runTxResult, txResult.hash, executedCall.trace, executedCall.accessList),
		})
	}
