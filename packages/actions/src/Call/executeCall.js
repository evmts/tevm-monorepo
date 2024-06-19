import { runTx } from '@tevm/vm'
import { bytesToHex, getAddress } from 'viem'
import { evmInputToImpersonatedTx } from '../internal/evmInputToImpersonatedTx.js'
import { runCallWithTrace } from '../internal/runCallWithTrace.js'
import { handleRunTxError } from './handleEvmError.js'

/**
 * @typedef {import('./handleEvmError.js').HandleRunTxError} ExecuteCallError
 */

/**
 * @typedef {{runTxResult: import("@tevm/vm").RunTxResult, trace: import('../debug/DebugResult.js').DebugTraceCallResult | undefined, accessList: undefined | Map<import('viem').Hex, Set<import('viem').Hex>>}} ExecuteCallResult
 */

/**
 * @param {import('@tevm/base-client').BaseClient} client
 * @param {import("@tevm/evm").EvmRunCallOpts} evmInput
 * @param {import('./CallParams.js').CallParams} params
 * @returns {Promise<ExecuteCallResult | {errors: [ExecuteCallError]}>}
 * @throws {never} returns errors as values
 */
export const executeCall = async (client, evmInput, params) => {
	/**
	 * @type {import('../debug/DebugResult.js').DebugTraceCallResult | undefined}
	 */
	let trace = undefined
	/**
	 * evm returns an access list without the 0x prefix
	 * @type {Map<import('viem').Hex, Set<import('viem').Hex>> | undefined}
	 */
	let accessList = undefined
	const vm = await client.getVm()
	try {
		const tx = await evmInputToImpersonatedTx({
			...client,
			getVm: () => Promise.resolve(vm),
		})(evmInput, params.maxFeePerGas, params.maxPriorityFeePerGas)
		if (params.createTrace) {
			// this trace will be filled in when the tx runs
			trace = await runCallWithTrace(vm, client.logger, evmInput, true).then(({ trace }) => trace)
		}
		const runTxResult = await runTx(vm)({
			reportAccessList: params.createAccessList ?? false,
			reportPreimages: params.createAccessList ?? false,
			skipHardForkValidation: true,
			skipBlockGasLimitValidation: true,
			// we currently set the nonce ourselves user can't set it
			skipNonce: true,
			skipBalance: evmInput.skipBalance ?? false,
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
		if (params.createAccessList && runTxResult.accessList !== undefined) {
			accessList = new Map(
				runTxResult.accessList.map((item) => [
					getAddress(item.address),
					new Set(item.storageKeys.map((key) => getAddress(key))),
				]),
			)
		}

		return { runTxResult, accessList, trace }
	} catch (e) {
		return { trace, accessList, errors: [handleRunTxError(e)] }
	}
}
