import { createAddress } from '@tevm/address'
import { createImpersonatedTx } from '@tevm/tx'
import { bytesToHex } from '@tevm/utils'
import { forkAndCacheBlock } from '../internal/forkAndCacheBlock.js'

/**
 * Creates a JSON-RPC procedure handler for the `debug_intermediateRoots` method
 *
 * This handler executes a block and returns the state root after each transaction
 * has been executed. This is useful for understanding how state changes incrementally
 * as each transaction in a block is processed.
 *
 * @param {import('@tevm/node').TevmNode} client - The TEVM node instance
 * @returns {import('./DebugProcedure.js').DebugIntermediateRootsProcedure} A handler function for debug_intermediateRoots requests
 * @throws {Error} If the block cannot be found
 * @throws {Error} If the parent block's state root is not available and cannot be forked
 *
 * @example
 * ```javascript
 * import { createTevmNode } from '@tevm/node'
 * import { debugIntermediateRootsJsonRpcProcedure } from '@tevm/actions'
 *
 * // Create a node with automatic mining
 * const node = createTevmNode({ miningConfig: { type: 'auto' } })
 *
 * // Get the latest block number
 * const blockNumber = await node.getBlockNumber()
 *
 * // Create the debug procedure handler
 * const debugProcedure = debugIntermediateRootsJsonRpcProcedure(node)
 *
 * // Get intermediate roots for the block
 * const response = await debugProcedure({
 *   jsonrpc: '2.0',
 *   method: 'debug_intermediateRoots',
 *   params: [blockNumber],
 *   id: 1
 * })
 *
 * console.log('Intermediate state roots:', response.result)
 * // Output: ['0x...', '0x...', ...] - one root per transaction
 * ```
 */
export const debugIntermediateRootsJsonRpcProcedure = (client) => {
	/**
	 * @param {import('./DebugJsonRpcRequest.js').DebugIntermediateRootsJsonRpcRequest} request
	 * @returns {Promise<import('./DebugJsonRpcResponse.js').DebugIntermediateRootsJsonRpcResponse>}
	 */
	return async (request) => {
		const blockParam = request.params[0]

		client.logger.debug({ blockParam }, 'debug_intermediateRoots: executing with params')

		let vm = await client.getVm()
		const block = await vm.blockchain.getBlockByTag(blockParam ?? 'latest')

		// If no transactions in the block, return empty array
		if (block.transactions.length === 0) {
			return {
				jsonrpc: '2.0',
				method: request.method,
				...(request.id !== undefined ? { id: request.id } : {}),
				result: [],
			}
		}

		const parentBlock = await vm.blockchain.getBlock(block.header.parentHash)

		// Ensure the parent block's state root is available
		const hasStateRoot = await vm.stateManager.hasStateRoot(parentBlock.header.stateRoot)
		if (!hasStateRoot && client.forkTransport) {
			vm = await forkAndCacheBlock(client, parentBlock)
		} else if (!hasStateRoot) {
			return {
				jsonrpc: '2.0',
				method: request.method,
				...(request.id !== undefined ? { id: request.id } : {}),
				error: {
					code: '-32602',
					message: 'State root not available for parent block',
				},
			}
		}

		// Clone the VM and set initial state
		const vmClone = await vm.deepCopy()
		await vmClone.stateManager.setStateRoot(parentBlock.header.stateRoot)

		// Array to store intermediate roots
		/** @type {Array<import('@tevm/utils').Hex>} */
		const intermediateRoots = []

		// Execute each transaction and capture state root after each one
		for (let i = 0; i < block.transactions.length; i++) {
			const blockTx = block.transactions[i]
			if (!blockTx) continue

			const impersonatedTx = createImpersonatedTx(
				{
					...blockTx,
					gasPrice: null,
					impersonatedAddress: createAddress(blockTx.getSenderAddress()),
				},
				{
					freeze: false,
					common: vmClone.common.ethjsCommon,
					allowUnlimitedInitCodeSize: true,
				},
			)

			// Execute the transaction
			await vmClone.runTx({
				block,
				skipNonce: true,
				skipBalance: true,
				skipHardForkValidation: true,
				skipBlockGasLimitValidation: true,
				tx: impersonatedTx,
			})

			// Get the state root after this transaction
			const stateRoot = vmClone.stateManager._baseState.getCurrentStateRoot()
			intermediateRoots.push(typeof stateRoot === 'string' ? stateRoot : bytesToHex(stateRoot))
		}

		return {
			jsonrpc: '2.0',
			method: request.method,
			result: intermediateRoots,
			...(request.id !== undefined ? { id: request.id } : {}),
		}
	}
}
