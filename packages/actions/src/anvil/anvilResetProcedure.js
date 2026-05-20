import { createMapDb } from '@evmts/zevm/receipt-manager'
import { captureSnapshotMetadata, restoreSnapshotState } from '../internal/snapshotMetadata.js'

/**
 * Request handler for anvil_reset JSON-RPC requests.
 * If the node is forked, anvil_reset will reset to the forked block.
 * @param {import('@tevm/node').TevmNode} node
 * @returns {import('./AnvilProcedure.js').AnvilResetProcedure}
 * @example
 * const node = createTevmNode()
 * const resetProcedure = anvilResetJsonRpcProcedure(node)
 * const result = await resetProcedure({ method: 'anvil_reset', params: [], id: 1, jsonrpc: '2.0' })
 * console.log(result) // { result: null, method: 'anvil_reset', jsonrpc: '2.0', id: 1 }
 */
export const anvilResetJsonRpcProcedure = (node) => {
	const initialSnapshotPromise = node.getVm().then(async (vm) => ({
		stateRoot: vm.stateManager._baseState.getCurrentStateRoot(),
		state: await vm.stateManager.dumpCanonicalGenesis(),
		...(await captureSnapshotMetadata(node, vm)),
	}))
	return async (request) => {
		const resetParams = /** @type {any} */ (request.params?.[0])
		const newForkUrl = resetParams?.forking?.jsonRpcUrl
		if (newForkUrl !== undefined) {
			if (!node.forkTransport || !('url' in node.forkTransport)) {
				return {
					jsonrpc: '2.0',
					method: request.method,
					error: {
						code: /** @type {const} */ ('-32602'),
						message: 'Cannot update fork URL on a non-forked node.',
					},
					...(request.id !== undefined ? { id: request.id } : {}),
				}
			}
			/** @type {any} */
			node.forkTransport.url = newForkUrl
		}

		// reset filters
		const filters = node.getFilters()
		filters.forEach((/** @type {any} */ filter) => {
			node.removeFilter(filter.id)
		})

		// reset impersonated account
		node.setImpersonatedAccount(undefined)
		node.setAutoImpersonate(false)
		const vm = await node.getVm()
		await restoreSnapshotState(node, await initialSnapshotPromise, vm)

		// reset receipts manager
		/**
		 * @type {any} making this any because we are modifying readonly properties
		 */
		const receiptManager = await node.getReceiptsManager()
		// TODO we should add a receiptManager.reset() method
		receiptManager.mapDb = createMapDb({ cache: new Map() })
		receiptManager.chain = vm.blockchain
		node.getSnapshots().clear()

		return {
			result: null,
			method: request.method,
			jsonrpc: '2.0',
			...(request.id !== undefined ? { id: request.id } : {}),
		}
	}
}
