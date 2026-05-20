import { createMapDb } from '@evmts/zevm/receipt-manager'
import { bytesToHex } from 'viem'

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
	return async (request) => {
		const resetParams = request.params?.[0]
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
					...(request.id ? { id: request.id } : {}),
				}
			}
			/** @type {any} */ (node.forkTransport).url = newForkUrl
		}

		// reset filters
		const filters = node.getFilters()
		filters.forEach((/** @type {any} */ filter) => {
			node.removeFilter(filter.id)
		})

		// reset impersonated account
		node.setImpersonatedAccount(undefined)
		node.setAutoImpersonate(false)
		node.setNextBlockTimestamp(undefined)
		node.setBlockTimestampInterval(undefined)
		node.setNextBlockGasLimit(undefined)
		node.setNextBlockBaseFeePerGas(undefined)
		node.setNextBlockPrevRandao(undefined)
		node.setMinGasPrice(undefined)

		// TODO we should add a txPool.reset() method
		const txPool = await node.getTxPool()
		const txs = await txPool.txsByPriceAndNonce()
		txs.forEach((/** @type {any} */ tx) => {
			txPool.removeByHash(bytesToHex(tx.hash()))
		})

		const vm = await node.getVm()
		const newStateManager = vm.stateManager.shallowCopy()
		const newBlockchain = vm.blockchain.shallowCopy()
		const forkedBlock = vm.blockchain.blocksByTag.get('forked')
		if (forkedBlock) {
			await newBlockchain.putBlock(forkedBlock)
		}
		vm.stateManager = /** @type {any}*/ (newStateManager)
		vm.evm.stateManager = /** @type {any}*/ (newStateManager)
		vm.blockchain = newBlockchain
		vm.evm.blockchain = newBlockchain

		// reset receipts manager
		/**
		 * @type {any} making this any because we are modifying readonly properties
		 */
		const receiptManager = await node.getReceiptsManager()
		// TODO we should add a receiptManager.reset() method
		receiptManager.mapDb = createMapDb({ cache: new Map() })
		receiptManager.chain = newBlockchain
		node.getSnapshots().clear()

		return {
			result: null,
			method: request.method,
			jsonrpc: '2.0',
			...(request.id ? { id: request.id } : {}),
		}
	}
}
