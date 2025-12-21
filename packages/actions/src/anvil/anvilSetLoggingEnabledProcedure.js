/**
 * Request handler for anvil_setLoggingEnabled JSON-RPC requests.
 * Enables or disables logging output from the Tevm node.
 *
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./AnvilProcedure.js').AnvilSetLoggingEnabledProcedure}
 * @example
 * ```typescript
 * import { createTevmNode } from '@tevm/node'
 * import { anvilSetLoggingEnabledJsonRpcProcedure } from '@tevm/actions'
 *
 * const node = createTevmNode()
 * const procedure = anvilSetLoggingEnabledJsonRpcProcedure(node)
 *
 * // Disable logging
 * const result = await procedure({
 *   jsonrpc: '2.0',
 *   method: 'anvil_setLoggingEnabled',
 *   params: [false],
 *   id: 1
 * })
 * console.log(result.result) // null
 * ```
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
			...(request.id ? { id: request.id } : {}),
		}
	}
}
