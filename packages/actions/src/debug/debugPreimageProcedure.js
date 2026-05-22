import { hexToBytes } from '@tevm/utils'

/**
 * Creates a JSON-RPC procedure handler for the `debug_preimage` method
 *
 * This handler returns the preimage (original data) for a given SHA3 hash if it
 * has been tracked/stored by the node. Preimages are typically tracked for
 * storage keys and account data to enable debugging and state inspection.
 *
 * Note: In the current implementation, preimage tracking is limited. The node
 * only tracks preimages that it has explicitly cached. For most use cases,
 * this will return null as full preimage tracking has significant performance
 * and storage overhead.
 *
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./DebugProcedure.js').DebugPreimageProcedure}
 */
export const debugPreimageJsonRpcProcedure = (client) => {
	/**
	 * @param {import('./DebugJsonRpcRequest.js').DebugPreimageJsonRpcRequest} request
	 * @returns {Promise<import('./DebugJsonRpcResponse.js').DebugPreimageJsonRpcResponse>}
	 */
	return async (request) => {
		const hash = request.params[0]

		client.logger.debug({ hash }, 'debug_preimage: executing with params')

		try {
			const vm = await client.getVm()
			const hashBytes = hexToBytes(hash)

			// Try to get the preimage from the state manager.
			// Preimage tracking is optional, so custom implementations may expose it.
			let preimage = null

			// Check if the state manager has a preimage method
			// @ts-expect-error - getPreimage is not a standard StateManager method but may exist on custom implementations
			if (typeof vm.stateManager.getPreimage === 'function') {
				try {
					// @ts-expect-error - getPreimage is not a standard StateManager method but may exist on custom implementations
					const preimageBytes = await vm.stateManager.getPreimage(hashBytes)
					if (preimageBytes) {
						preimage = `0x${Buffer.from(preimageBytes).toString('hex')}`
					}
				} catch (err) {
					client.logger.debug({ err, hash }, 'debug_preimage: preimage not found')
				}
			} else {
				// Preimage tracking is not available in this state manager
				client.logger.debug({ hash }, 'debug_preimage: preimage tracking not available in state manager')
			}

			return {
				jsonrpc: '2.0',
				method: request.method,
				result: /** @type {any} */ (preimage),
				...(request.id !== undefined ? { id: request.id } : {}),
			}
		} catch (err) {
			client.logger.error({ err, hash }, 'debug_preimage: error getting preimage')
			return {
				jsonrpc: '2.0',
				method: request.method,
				...(request.id !== undefined ? { id: request.id } : {}),
				error: {
					code: '-32603',
					message: err instanceof Error ? err.message : 'Internal error getting preimage',
				},
			}
		}
	}
}
