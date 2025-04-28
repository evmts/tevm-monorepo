import { debugTraceStateFilters } from './DebugParams.js'

/**
 * Request handler for debug_traceState JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./DebugProcedure.js').DebugTraceStateProcedure}
 */
export const debugTraceStateJsonRpcProcedure = (client) => {
	/**
	 * @template {Array<import('./DebugParams.js').DebugTraceStateFilter>} TStateFilters
	 * @param {import('./DebugJsonRpcRequest.js').DebugTraceStateJsonRpcRequest<TStateFilters>} request
	 * @returns {Promise<import('./DebugJsonRpcResponse.js').DebugTraceStateJsonRpcResponse<TStateFilters>>}
	 */
	return async (request) => {
		const { filters: _filters, timeout } = request.params[0]
		if (timeout !== undefined) {
			client.logger.warn('Warning: timeout is currently respected param of debug_traceState')
		}

		const filters = _filters === undefined || _filters.length === 0 ? debugTraceStateFilters : _filters

		/** @type {any} */
		const trace = {}

		const vm = await client.getVm()
		const txPool = await client.getTxPool()

		// TODO: do we need to make all of the following json serializable?
		if (filters.includes('blockchain') || filters.includes('blockchain.blocksByNumber')) {
			trace['blockchain'] = { blocksByNumber: vm.blockchain.blocksByNumber }
		}
		if (filters.includes('blockchain') || filters.includes('blockchain.initOptions')) {
			trace['blockchain'] = {
				...(trace['blockchain'] ?? {}),
				initOptions: vm.blockchain.options,
			}
		}

		if (filters.includes('evm') || filters.includes('evm.opcodes')) {
			trace['evm'] = { opcodes: vm.evm.getActiveOpcodes() }
		}
		if (filters.includes('evm') || filters.includes('evm.precompiles')) {
			trace['evm'] = {
				...(trace['evm'] ?? {}),
				precompiles: vm.evm.precompiles,
			}
		}

		if (filters.includes('evm') || filters.includes('evm.common') || filters.includes('evm.common.eips')) {
			trace['evm'] = {
				...(trace['evm'] ?? {}),
				common: {
					eips: vm.evm.common.eips(),
				},
			}
		}
		if (filters.includes('evm') || filters.includes('evm.common') || filters.includes('evm.common.hardfork')) {
			trace['evm'] = {
				...(trace['evm'] ?? {}),
				common: {
					...(trace['evm']?.common ?? {}),
					hardfork: vm.evm.common.hardfork(),
				},
			}
		}
		if (filters.includes('evm') || filters.includes('evm.common') || filters.includes('evm.common.consensus')) {
			trace['evm'] = {
				...(trace['evm'] ?? {}),
				common: {
					...(trace['evm']?.common ?? {}),
					consensus: {
						algorithm: vm.evm.common.consensusAlgorithm(),
						type: vm.evm.common.consensusType(),
					},
				},
			}
		}

		if (filters.includes('node') || filters.includes('node.status')) {
			trace['node'] = {
				status: client.status,
			}
		}
		if (filters.includes('node') || filters.includes('node.mode')) {
			trace['node'] = {
				...(trace['node'] ?? {}),
				mode: client.mode,
			}
		}
		if (filters.includes('node') || filters.includes('node.miningConfig')) {
			trace['node'] = {
				...(trace['node'] ?? {}),
				miningConfig: client.miningConfig,
			}
		}
		if (filters.includes('node') || filters.includes('node.filters')) {
			trace['node'] = {
				...(trace['node'] ?? {}),
				filters: client.getFilters(),
			}
		}
		if (filters.includes('node') || filters.includes('node.impersonatedAccount')) {
			trace['node'] = {
				...(trace['node'] ?? {}),
				impersonatedAccount: client.getImpersonatedAccount(),
			}
		}

		if (filters.includes('pool') || filters.includes('pool.pool')) {
			trace['pool'] = {
				pool: txPool.pool,
			}
		}
		if (filters.includes('pool') || filters.includes('pool.txsByHash')) {
			trace['pool'] = {
				...(trace['pool'] ?? {}),
				txsByHash: txPool.txsByHash,
			}
		}
		if (filters.includes('pool') || filters.includes('pool.txsByNonce')) {
			trace['pool'] = {
				...(trace['pool'] ?? {}),
				txsByNonce: txPool.txsByNonce,
			}
		}
		if (filters.includes('pool') || filters.includes('pool.txsInNonceOrder')) {
			trace['pool'] = {
				...(trace['pool'] ?? {}),
				txsInNonceOrder: txPool.txsInNonceOrder,
			}
		}
		if (filters.includes('pool') || filters.includes('pool.txsInPool')) {
			trace['pool'] = {
				...(trace['pool'] ?? {}),
				txsInPool: txPool.txsInPool,
			}
		}

		if (filters.includes('stateManager') || filters.includes('stateManager.storage')) {
			trace['stateManager'] = {
				...(trace['stateManager'] ?? {}),
				storage: await vm.stateManager.dumpCanonicalGenesis(),
			}
		}
		if (filters.includes('stateManager') || filters.includes('stateManager.stateRoots')) {
			trace['stateManager'] = {
				...(trace['stateManager'] ?? {}),
				stateRoots: vm.stateManager._baseState.stateRoots,
			}
		}

		return {
			method: request.method,
			result: /** @type {any} */ (trace),
			jsonrpc: '2.0',
			...(request.id ? { id: request.id } : {}),
		}
	}
}
