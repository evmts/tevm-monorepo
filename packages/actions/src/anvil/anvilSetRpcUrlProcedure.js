/**
 * Request handler for anvil_setRpcUrl JSON-RPC requests.
 * Sets a new RPC URL for forking mode. This method is primarily used to change
 * the backend RPC node without restarting the Tevm instance.
 *
 * Note: This implementation has limitations as the TevmNode's forkTransport
 * is readonly. In a real Anvil implementation, this would require modifying
 * the underlying StateManager's forking configuration. For now, this method
 * is provided for API compatibility but may not fully change the fork behavior.
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

		if (!client.forkTransport) {
			return {
				jsonrpc: '2.0',
				method: request.method,
				error: {
					code: /** @type {const} */ ('-32602'),
					message: 'Cannot set RPC URL on a non-forked node. Create the node with fork configuration.',
				},
				...(request.id ? { id: request.id } : {}),
			}
		}

		// Note: This is a limitation of the current implementation.
		// The forkTransport is readonly and deeply integrated into the StateManager.
		// To properly support this, we would need to:
		// 1. Allow mutable forkTransport or
		// 2. Provide a way to update the StateManager's fork configuration
		//
		// For now, we log a warning and update the url property if it exists
		const oldUrl = 'url' in client.forkTransport ? /** @type {any} */ (client.forkTransport).url : undefined
		client.logger.warn(
			{ oldUrl, newUrl },
			'anvil_setRpcUrl has limited support. The fork URL cannot be fully changed without recreating the node.',
		)

		// If the transport has a mutable url property, update it
		if ('url' in client.forkTransport && typeof (/** @type {any} */ (client.forkTransport).url) === 'string') {
			// This is a best-effort attempt, but it may not affect existing cached state
			/** @type {any} */
			client.forkTransport.url = newUrl
		}

		return {
			jsonrpc: '2.0',
			method: request.method,
			result: null,
			...(request.id ? { id: request.id } : {}),
		}
	}
}
