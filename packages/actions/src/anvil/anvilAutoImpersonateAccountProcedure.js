/**
 * Request handler for anvil_autoImpersonateAccount JSON-RPC requests.
 * Enables or disables automatic impersonation of all transaction senders.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./AnvilProcedure.js').AnvilAutoImpersonateAccountProcedure}
 * @example
 * ```typescript
 * // Enable auto-impersonation
 * const result = await client.request({
 *   method: 'anvil_autoImpersonateAccount',
 *   params: [true],
 *   id: 1,
 *   jsonrpc: '2.0'
 * })
 * console.log(result) // { jsonrpc: '2.0', id: 1, method: 'anvil_autoImpersonateAccount', result: null }
 *
 * // Disable auto-impersonation
 * const result2 = await client.request({
 *   method: 'anvil_autoImpersonateAccount',
 *   params: [false],
 *   id: 2,
 *   jsonrpc: '2.0'
 * })
 * ```
 */
export const anvilAutoImpersonateAccountJsonRpcProcedure = (client) => {
	return async (request) => {
		try {
			const enabled = request.params[0]
			client.setAutoImpersonate(enabled)
			return {
				jsonrpc: '2.0',
				method: request.method,
				...(request.id ? { id: request.id } : {}),
				result: null,
			}
		} catch (e) {
			return {
				jsonrpc: '2.0',
				method: request.method,
				...(request.id ? { id: request.id } : {}),
				error: {
					code: /** @type any*/ (-32602),
					message: /** @type {Error}*/ (e).message,
				},
			}
		}
	}
}
