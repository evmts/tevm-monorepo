import { restoreSnapshotState } from '../internal/snapshotMetadata.js'

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
			const vm = await client.getVm()
			await restoreSnapshotState(client, snapshot, vm)

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
