import { runTx } from '@tevm/vm'
import { bytesToHex } from 'viem'
import { evmInputToImpersonatedTx } from '../internal/evmInputToImpersonatedTx.js'
import { runCallWithTrace } from '../internal/runCallWithTrace.js'
import { setupPrefetchProxy } from '../internal/setupPrefetchProxy.js'
import { handleRunTxError } from './handleEvmError.js'

/**
 * The error returned by executeCall
 * @internal
 * @typedef {import('./handleEvmError.js').HandleRunTxError} ExecuteCallError
 */

/**
 * The return value of executeCall
 * @internal
 * @typedef {{runTxResult: import("@tevm/vm").RunTxResult, trace: import('../debug/DebugResult.js').EvmTraceResult | undefined, accessList: undefined | Map<string, Set<string>>}} ExecuteCallResult
 */

/**
 * executeCall encapsalates the internal logic of running a call in the EVM
 * @internal
 * @param {import('@tevm/node').TevmNode} client
 * @param {import("@tevm/evm").EvmRunCallOpts} evmInput
 * @param {import('./CallParams.js').CallParams} params
 * @param {import('../common/CallEvents.js').CallEvents} [events] - Optional event handlers for EVM execution
 * @returns {Promise<(ExecuteCallResult & {errors?: [ExecuteCallError]}) | {errors: [ExecuteCallError]}>}
 * @throws {never} returns errors as values
 */
export const executeCall = async (client, evmInput, params, events) => {
	/**
	 * @type {import('../debug/DebugResult.js').EvmTraceResult | undefined}
	 */
	let trace = undefined
	/**
	 * evm returns an access list without the 0x prefix
	 * @type {Map<string, Set<string>> | undefined}
	 */
	let accessList = undefined
	const vm = await client.getVm()

	// Register event handlers if provided
	if (events?.onStep) vm.evm.events?.on('step', events.onStep)
	if (events?.onNewContract) vm.evm.events?.on('newContract', events.onNewContract)
	if (events?.onBeforeMessage) vm.evm.events?.on('beforeMessage', events.onBeforeMessage)
	if (events?.onAfterMessage) vm.evm.events?.on('afterMessage', events.onAfterMessage)

	try {
		const tx = await evmInputToImpersonatedTx({
			...client,
			getVm: () => Promise.resolve(vm),
		})(evmInput, params.maxFeePerGas, params.maxPriorityFeePerGas)
		if (params.createTrace) {
			// this trace will be filled in when the tx runs
			trace = await runCallWithTrace(vm, client.logger, evmInput, true).then(({ trace }) => trace)
		}

		// Always create access list for optimization purposes even if not explicitly requested
		const createAccessList = true

		const runTxResult = await runTx(vm)({
			reportAccessList: createAccessList,
			reportPreimages: createAccessList,
			skipHardForkValidation: true,
			skipBlockGasLimitValidation: true,
			// we currently set the nonce ourselves user can't set it
			skipNonce: true,
			// we must skipBalance for now because we have no clue what the gasLimit should be so this initial run we set it to block maximum
			skipBalance: true,
			...(evmInput.block !== undefined ? { block: /** @type any*/ (evmInput.block) } : {}),
			tx,
		})

		if (trace) {
			trace.gas = runTxResult.execResult.executionGasUsed
			trace.failed = false
			trace.returnValue = bytesToHex(runTxResult.execResult.returnValue)
		}

		client.logger.debug(
			{
				returnValue: bytesToHex(runTxResult.execResult.returnValue),
				exceptionError: runTxResult.execResult.exceptionError,
				executionGasUsed: runTxResult.execResult.executionGasUsed,
			},
			'callHandler: runCall result',
		)

		if (runTxResult.accessList !== undefined) {
			accessList = new Map(
				runTxResult.accessList.map((item) => {
					return [item.address, new Set(item.storageKeys)]
				}),
			)

			// Instead of immediate prefetching, set up the proxy to detect storage requests
			await setupPrefetchProxy(client, accessList)

			// If not explicitly requested, don't include access list in the response
			if (!params.createAccessList) {
				accessList = undefined
			}
		}

		return {
			runTxResult,
			accessList,
			trace,
			...(runTxResult.execResult.exceptionError !== undefined
				? { errors: [handleRunTxError(runTxResult.execResult.exceptionError)] }
				: {}),
		}
	} catch (e) {
		return {
			trace,
			accessList,
			errors: [handleRunTxError(e)],
		}
	} finally {
		// Clean up event handlers to prevent memory leaks
		if (events?.onStep) vm.evm.events?.off('step', events.onStep)
		if (events?.onNewContract) vm.evm.events?.off('newContract', events.onNewContract)
		if (events?.onBeforeMessage) vm.evm.events?.off('beforeMessage', events.onBeforeMessage)
		if (events?.onAfterMessage) vm.evm.events?.off('afterMessage', events.onAfterMessage)
	}
}
