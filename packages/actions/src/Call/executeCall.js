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
 * executeCall encapsulates the internal logic of running a call in the EVM
 * with optimized asynchronous storage prefetch
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
	// Create abort controller for cancelling prefetch if main execution finishes first
	const prefetchController = new AbortController()
	const signal = prefetchController.signal
	
	// Start asynchronous storage prefetch that can be cancelled
	const prefetchPromise = (async () => {
		try {
			client.logger.debug('Starting asynchronous storage prefetch')
			if (!client.forkTransport) return
			
			const blockTag = await client.getVm()
				.then(vm => vm.blockchain.blocksByTag.get('forked'))
				.then(block => block !== undefined ? numberToHex(block.header.number) : 'latest')
			
			// Request access list for transaction
			if (signal.aborted) return
			
			/**
			 * @type {import('../eth/EthJsonRpcResponse.js').EthCreateAccessListJsonRpcResponse}
			 */
			const accessListRes = await client.forkTransport?.request({
				method: 'eth_createAccessList',
				params: [
					{
						to: evmInput.to,
						gas: evmInput.gasLimit,
						value: evmInput.value,
						data: evmInput.data,
					},
					blockTag,
				],
			})
			
			if (signal.aborted) return
			
			if (accessListRes.error) {
				client.logger.error('Unable to get an access list', accessListRes.error)
				return
			}
			
			// Process each contract and storage key in the access list
			const accessList = accessListRes.result?.accessList ?? []
			const prefetchPromises = []
			
			for (const contract of accessList) {
				if (signal.aborted) return
				
				for (const storageKey of contract.storageKeys) {
					if (signal.aborted) return
					
					const address = createAddress(contract.address)
					const keyBytes = hexToBytes(storageKey, { size: 32 })
					
					// Check if storage is already available before making request
					const getStorage = () => vm.stateManager._baseState.caches.storage.get(address, keyBytes)
					if (getStorage()?.length) {
						continue // Skip to next storage key
					}
					
					// Create promise for fetching this storage slot
					const storagePromise = (async () => {
						if (signal.aborted) return
						
						try {
							/**
							 * @type {import('../eth/EthJsonRpcResponse.js').EthCreateAccessListJsonRpcResponse}
							 */
							const storage = await client.forkTransport.request({
								method: 'eth_getStorageAt',
								params: [contract.address, storageKey, blockTag]
							})
							
							if (signal.aborted) return
							
							// Get latest VM instance to avoid stale references
							const currentVm = await client.getVm()
							
							// Double-check storage isn't already set (race condition prevention)
							if (getStorage()?.length) {
								return
							}
							
							// Store the fetched value in cache
							currentVm.stateManager._baseState.caches.storage.put(
								address,
								keyBytes,
								hexToBytes(/** @type {import('viem').Hex}*/(storage))
							)
						} catch (err) {
							if (!signal.aborted) {
								client.logger.debug({ err, address: contract.address, key: storageKey }, 
									'Error prefetching storage slot')
							}
						}
					})()
					
					prefetchPromises.push(storagePromise)
				}
			}
			
			// Wait for all storage prefetch operations to complete
			await Promise.allSettled(prefetchPromises)
			
			if (!signal.aborted) {
				client.logger.debug(
					{ contractCount: accessList.length, aborted: signal.aborted },
					'Completed asynchronous storage prefetch'
				)
			}
		} catch (err) {
			if (!signal.aborted) {
				client.logger.error({ err }, 'Error in storage prefetch')
			}
		}
	})()
	
	// Don't await the prefetch promise, allowing the main execution to proceed
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

		// Main execution is complete, cancel the prefetch operation if it's still running
		prefetchController.abort()
		client.logger.debug('Main execution completed, cancelling any ongoing prefetch operations')

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
		// Make sure to cancel the prefetch operation on error
		prefetchController.abort()
		client.logger.debug('Main execution encountered an error, cancelling any ongoing prefetch operations')
		
		return {
			trace,
			accessList,
			errors: [handleRunTxError(e)],
		}
	} finally {
		// If somehow we get here without cancelling the prefetch, make sure it's cancelled
		if (!prefetchController.signal.aborted) {
			prefetchController.abort()
		}
	}
}
