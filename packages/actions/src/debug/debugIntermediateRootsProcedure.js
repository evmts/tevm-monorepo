import { createImpersonatedTx } from '@evmts/zevm/tx'
import { createAddress } from '@tevm/address'
import { bytesToHex } from '@tevm/utils'
import { forkAndCacheBlock } from '../internal/forkAndCacheBlock.js'

/**
 * Creates a JSON-RPC procedure handler for the `debug_intermediateRoots` method
 *
 * This handler executes a block and returns the state root after each transaction
 * has been executed. This is useful for understanding how state changes incrementally
 * as each transaction in a block is processed.
 *
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./DebugProcedure.js').DebugIntermediateRootsProcedure}
 * @throws {Error} If the block cannot be found or its parent state cannot be forked.
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
					nonce: blockTx.nonce,
					gasLimit: blockTx.gasLimit,
					value: blockTx.value,
					data: blockTx.data,
					impersonatedAddress: createAddress(blockTx.getSenderAddress()),
					...(blockTx.to !== undefined ? { to: blockTx.to } : {}),
					...('accessList' in blockTx && blockTx.accessList !== undefined ? { accessList: blockTx.accessList } : {}),
					...('maxFeePerGas' in blockTx
						? { maxFeePerGas: blockTx.maxFeePerGas }
						: 'gasPrice' in blockTx
							? { maxFeePerGas: blockTx.gasPrice }
							: {}),
					...('maxPriorityFeePerGas' in blockTx ? { maxPriorityFeePerGas: blockTx.maxPriorityFeePerGas } : {}),
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
			await vmClone.stateManager.checkpoint()
			await vmClone.stateManager.commit(true)

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
