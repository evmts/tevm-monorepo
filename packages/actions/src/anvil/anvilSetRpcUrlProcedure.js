import { resetForkState } from '../internal/resetForkState.js'

/**
 * Request handler for anvil_setRpcUrl JSON-RPC requests.
 * Sets a new RPC URL for forking mode. This method is primarily used to change
 * the backend RPC node without restarting the Tevm instance.
 *
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./AnvilProcedure.js').AnvilSetRpcUrlProcedure}
 * @throws {Error} if attempting to set a fork URL on a non-forked node
 * @example
 * ```typescript
 * import { createTevmNode } from '@tevm/node'
 * import { anvilSetRpcUrlJsonRpcProcedure } from '@tevm/actions'
 *
 * const node = createTevmNode({ fork: { url: 'https://mainnet.optimism.io' } })
 * const procedure = anvilSetRpcUrlJsonRpcProcedure(node)
 *
 * // Change the fork URL
 * const result = await procedure({
 *   jsonrpc: '2.0',
 *   method: 'anvil_setRpcUrl',
 *   params: ['https://mainnet.infura.io/v3/your-api-key'],
 *   id: 1
 * })
 * console.log(result.result) // null
 * ```
 */
export const anvilSetRpcUrlJsonRpcProcedure = (client) => {
	return async (request) => {
		const newUrl = request.params[0]
		if (typeof newUrl !== 'string' || newUrl.length === 0) {
			return {
				jsonrpc: '2.0',
				method: request.method,
				error: {
					code: /** @type {const} */ ('-32602'),
					message: 'Invalid RPC URL.',
				},
				...(request.id !== undefined ? { id: request.id } : {}),
			}
		}

		if (!client.forkTransport) {
			return {
				jsonrpc: '2.0',
				method: request.method,
				error: {
					code: /** @type {const} */ ('-32602'),
					message: 'Cannot set RPC URL on a non-forked node. Create the node with fork configuration.',
				},
				...(request.id !== undefined ? { id: request.id } : {}),
			}
		}

		const oldUrl = 'url' in client.forkTransport ? /** @type {any} */ (client.forkTransport).url : undefined
		client.logger.info({ oldUrl, newUrl }, 'Updated fork RPC URL backing transport and invalidated snapshots.')

		if ('url' in client.forkTransport && typeof (/** @type {any} */ (client.forkTransport).url) === 'string') {
			/** @type {any} */
			client.forkTransport.url = newUrl
		}
		await resetForkState(client, 'latest')
		client.getSnapshots().clear()

		return {
			jsonrpc: '2.0',
			method: request.method,
			result: null,
			...(request.id !== undefined ? { id: request.id } : {}),
		}
	}
}
