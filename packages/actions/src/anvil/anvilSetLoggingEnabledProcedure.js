/**
 * Request handler for anvil_setLoggingEnabled JSON-RPC requests.
 * Enables or disables logging output from the Tevm node.
 *
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./AnvilProcedure.js').AnvilSetLoggingEnabledProcedure}
 */
export const anvilSetLoggingEnabledJsonRpcProcedure = (client) => {
	return async (request) => {
		const enabled = request.params[0]

		// Set the logger level based on enabled state
		// When disabled, set to 'silent', when enabled set to 'info'
		client.logger.level = enabled ? 'info' : 'silent'

		return {
			jsonrpc: '2.0',
			method: request.method,
			result: null,
			...(request.id !== undefined ? { id: request.id } : {}),
		}
	}
}
