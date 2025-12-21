/**
 * Request handler for anvil_snapshot JSON-RPC requests.
 * Snapshots the current state and returns a unique snapshot ID.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./AnvilProcedure.js').AnvilSnapshotProcedure}
 * @example
 * ```javascript
 * import { createTevmNode } from '@tevm/node'
 * import { anvilSnapshotJsonRpcProcedure } from '@tevm/actions'
 *
 * const client = createTevmNode()
 * const snapshotHandler = anvilSnapshotJsonRpcProcedure(client)
 *
 * const response = await snapshotHandler({
 *   jsonrpc: '2.0',
 *   method: 'anvil_snapshot',
 *   id: 1,
 *   params: []
 * })
 * console.log(response.result) // '0x1'
 * ```
 */
export const anvilSnapshotJsonRpcProcedure = (client) => {
	return async (request) => {
		try {
			const vm = await client.getVm()
			const stateRoot = vm.stateManager._baseState.getCurrentStateRoot()
			const state = await vm.stateManager.dumpCanonicalGenesis()
			const snapshotId = client.addSnapshot(stateRoot, state)

			client.logger.debug({ snapshotId, stateRoot }, 'Created snapshot')

			/**
			 * @type {import('./AnvilJsonRpcResponse.js').AnvilSnapshotJsonRpcResponse}
			 */
			const response = {
				jsonrpc: '2.0',
				method: request.method,
				result: /** @type {`0x${string}`} */ (snapshotId),
				...(request.id !== undefined ? { id: request.id } : {}),
			}
			return response
		} catch (e) {
			client.logger.error(e, 'anvil_snapshot failed')
			/**
			 * @type {import('./AnvilJsonRpcResponse.js').AnvilSnapshotJsonRpcResponse}
			 */
			const response = {
				jsonrpc: '2.0',
				method: request.method,
				...(request.id !== undefined ? { id: request.id } : {}),
				error: {
					// TODO use @tevm/errors
					code: /** @type {const} */ ('-32603'),
					message: e instanceof Error ? e.message : 'Unknown error',
				},
			}
			return response
		}
	}
}
