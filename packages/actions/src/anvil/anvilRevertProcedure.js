import { bytesToHex } from '@tevm/utils'

/**
 * Request handler for anvil_revert JSON-RPC requests.
 * Reverts the state to a previous snapshot.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./AnvilProcedure.js').AnvilRevertProcedure}
 * @example
 * ```javascript
 * import { createTevmNode } from '@tevm/node'
 * import { anvilRevertJsonRpcProcedure } from '@tevm/actions'
 *
 * const client = createTevmNode()
 * const revertHandler = anvilRevertJsonRpcProcedure(client)
 *
 * // First create a snapshot
 * const snapshotResponse = await client.request({
 *   method: 'anvil_snapshot'
 * })
 * const snapshotId = snapshotResponse.result
 *
 * // Later revert to that snapshot
 * const response = await revertHandler({
 *   jsonrpc: '2.0',
 *   method: 'anvil_revert',
 *   id: 1,
 *   params: [snapshotId]
 * })
 * console.log(response.result) // true if successful, false if snapshot not found
 * ```
 */
export const anvilRevertJsonRpcProcedure = (client) => {
	return async (request) => {
		try {
			const snapshotId = request.params[0]
			const snapshot = client.getSnapshot(snapshotId)

			if (!snapshot) {
				client.logger.debug({ snapshotId }, 'Snapshot not found')
				/**
				 * @type {import('./AnvilJsonRpcResponse.js').AnvilRevertJsonRpcResponse}
				 */
				const response = {
					jsonrpc: '2.0',
					method: request.method,
					result: false,
					...(request.id !== undefined ? { id: request.id } : {}),
				}
				return response
			}
			const snapshotStateRoot =
				typeof snapshot.stateRoot === 'string'
					? snapshot.stateRoot
					: bytesToHex(/** @type {Uint8Array} */ (snapshot.stateRoot ?? new Uint8Array()))
			if (!snapshot.state || typeof snapshotStateRoot !== 'string' || !snapshotStateRoot.startsWith('0x')) {
				throw new Error('Invalid snapshot payload')
			}

			const vm = await client.getVm()

			const txPool = await client.getTxPool()
			// Save the state root with its associated state
			vm.stateManager.saveStateRoot(
				/** @type {any} */ (Uint8Array.from(Buffer.from(snapshotStateRoot.slice(2), 'hex'))),
				snapshot.state,
			)

			// Set the state root to revert to that state
			await vm.stateManager.setStateRoot(
				/** @type {any} */ (Uint8Array.from(Buffer.from(snapshotStateRoot.slice(2), 'hex'))),
			)

			if (snapshot.impersonatedAccount) {
				client.setImpersonatedAccount(snapshot.impersonatedAccount)
			} else {
				client.setImpersonatedAccount(undefined)
			}
			client.setAutoImpersonate(Boolean(snapshot.autoImpersonate))
			client.miningConfig = snapshot.miningConfig ?? client.miningConfig
			client.setNextBlockTimestamp(
				snapshot.nextBlockTimestamp !== undefined ? BigInt(snapshot.nextBlockTimestamp) : undefined,
			)
			client.setNextBlockGasLimit(
				snapshot.nextBlockGasLimit !== undefined ? BigInt(snapshot.nextBlockGasLimit) : undefined,
			)
			client.setNextBlockBaseFeePerGas(
				snapshot.nextBlockBaseFeePerGas !== undefined ? BigInt(snapshot.nextBlockBaseFeePerGas) : undefined,
			)
			client.setNextBlockPrevRandao(
				snapshot.nextBlockPrevRandao !== undefined ? BigInt(snapshot.nextBlockPrevRandao) : undefined,
			)
			client.setMinGasPrice(snapshot.minGasPrice !== undefined ? BigInt(snapshot.minGasPrice) : undefined)
			client.setBlockTimestampInterval(
				snapshot.blockTimestampInterval !== undefined ? BigInt(snapshot.blockTimestampInterval) : undefined,
			)

			const txs = await txPool.txsByPriceAndNonce()
			for (const tx of txs) {
				txPool.removeByHash(bytesToHex(tx.hash()))
			}

			// Delete all snapshots from this ID onwards (they are now invalid)
			client.deleteSnapshotsFrom(snapshotId)

			client.logger.debug({ snapshotId, stateRoot: snapshot.stateRoot }, 'Reverted to snapshot')

			/**
			 * @type {import('./AnvilJsonRpcResponse.js').AnvilRevertJsonRpcResponse}
			 */
			const response = {
				jsonrpc: '2.0',
				method: request.method,
				result: true,
				...(request.id !== undefined ? { id: request.id } : {}),
			}
			return response
		} catch (e) {
			client.logger.error(e, 'anvil_revert failed')
			/**
			 * @type {import('./AnvilJsonRpcResponse.js').AnvilRevertJsonRpcResponse}
			 */
			const response = {
				jsonrpc: '2.0',
				method: request.method,
				result: false,
				...(request.id !== undefined ? { id: request.id } : {}),
			}
			return response
		}
	}
}
