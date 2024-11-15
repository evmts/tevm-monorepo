import { runTx } from '@tevm/vm'
import { bytesToHex, hexToBytes, numberToHex } from 'viem'
import { evmInputToImpersonatedTx } from '../internal/evmInputToImpersonatedTx.js'
import { runCallWithTrace } from '../internal/runCallWithTrace.js'
import { handleRunTxError } from './handleEvmError.js'
import { createAddress } from '@tevm/address'

/**
 * The error returned by executeCall
 * @internal
 * @typedef {import('./handleEvmError.js').HandleRunTxError} ExecuteCallError
 */

/**
 * The return value of executeCall
 * @internal
 * @typedef {{runTxResult: import("@tevm/vm").RunTxResult, trace: import('../debug/DebugResult.js').DebugTraceCallResult | undefined, accessList: undefined | Map<string, Set<string>>}} ExecuteCallResult
 */

/**
 * executeCall encapsalates the internal logic of running a call in the EVM
 * @internal
 * @param {import('@tevm/node').TevmNode} client
 * @param {import("@tevm/evm").EvmRunCallOpts} evmInput
 * @param {import('./CallParams.js').CallParams} params
 * @returns {Promise<(ExecuteCallResult & {errors?: [ExecuteCallError]}) | {errors: [ExecuteCallError]}>}
 * @throws {never} returns errors as values
 */
export const executeCall = async (client, evmInput, params) => {
	/**
	 * @type {import('../debug/DebugResult.js').DebugTraceCallResult | undefined}
	 */
	let trace = undefined
	/**
	 * evm returns an access list without the 0x prefix
	 * @type {Map<string, Set<string>> | undefined}
	 */
	let accessList = undefined
	const vm = await client.getVm()
		// as an optimization we want to attempt to fetch all storage up front
		; (async () => {
			if (!client.forkTransport) return
			const blockTag = await client.getVm()
				.then(vm => vm.blockchain.blocksByTag.get('forked'))
				.then(block => block !== undefined ? numberToHex(block.header.number) : 'latest')
			// TODO this is wrong we should use forkTransport.send but it doesn't exist yet
			/**
			 * @type {import('../eth/EthJsonRpcResponse.js').EthCreateAccessListJsonRpcResponse}
			 */
			const accessListRes = await client.forkTransport?.request({
				method: 'eth_createAccessList',
				params: [
					{
						to: evmInput.to,
						gas: evmInput.gasLimit,
						// gasPrice: evmInput.gasPrice, not necessary to set this
						value: evmInput.value,
						data: evmInput.data,
					},
					blockTag,
				],
			})
			if (accessListRes.error) {
				client.logger.error('Unable to get an access list', accessListRes.error)
			}
			for (const contract of accessListRes.result?.accessList ?? []) {
				for (const storageKey of contract.storageKeys) {
					const getStorage = () => vm.stateManager._baseState.caches.storage.get(createAddress(contract.address), hexToBytes(storageKey, { size: 32 }))
					if (getStorage()?.length) {
						return
					}
					/**
					 * @type {import('../eth/EthJsonRpcResponse.js').EthCreateAccessListJsonRpcResponse}
					 */
					client.forkTransport.request({
						method: 'eth_getStorageAt',
						params: [contract.address, storageKey, blockTag]
					}).then(async storage => {
						const vm = await client.getVm()
						// THIS MUST BE SYNC TO INITIALLY SET STORAGE OR RACE CONDITIONS WILL EXIST!!!
						// This can be cleaned up with a state lock later
						if (getStorage()?.length) {
							return
						}
						vm.stateManager._baseState.caches.storage
							.put(
								createAddress(contract.address),
								hexToBytes(storageKey, { size: 32 }),
								hexToBytes(/** @type {import('viem').Hex}*/(storage))
							)
					})
				}
			}
		})()
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
		if (params.createAccessList && runTxResult.accessList !== undefined) {
			accessList = new Map(
				runTxResult.accessList.map((item) => {
					return [item.address, new Set(item.storageKeys)]
				}),
			)
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
	}
}
