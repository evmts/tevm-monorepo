/**
 * @deprecated
 * Makes a JSON-RPC request to a url
 * Returns the entire JSON-RPC response rather than throwing and only returning result
 * Used currently as an adapter to avoid refactoring existing code
 * @see https://ethereum.org/en/developers/docs/apis/json-rpc/
 * @param {{request: import('@tevm/utils').EIP1193RequestFn}} client
 * @returns {import("./JsonRpcClient.js").JsonRpcClient} the `result` field from the JSON-RPC response
 * @example
 * ```typescript
 * const url = 'https://mainnet.optimism.io'
 * const params = {
 *   method: 'eth_getBlockByNumber',
 *   params: ['latest', false],
 * }
 * const {result: block} = await fetchJsonRpc(url, params)
 * ```
 */
export const createJsonRpcFetcher = (client) => {
	return {
		request: async (request) => {
			try {
				const result = await client.request(/** @type {{method: string, params?: readonly unknown[]}} */ (request))
				return {
					jsonrpc: '2.0',
					result,
					method: request.method,
					...(request.params !== undefined ? { params: request.params } : {}),
					...(request.id !== undefined ? { id: request.id } : {}),
				}
			} catch (e) {
				if (typeof e === 'object' && e !== null && 'code' in e) {
					return {
						jsonrpc: '2.0',
						error: {
							code: /** @type {string}*/ (e.code),
							message: 'message' in e ? /** @type {string}*/ (e.message) : 'Unknown error in jsonrpc request',
						},
						method: request.method,
						...(request.params !== undefined ? { params: request.params } : {}),
						...(request.id !== undefined ? { id: request.id } : {}),
					}
				}
				return {
					jsonrpc: '2.0',
					error: {
						code: -32000,
						message: 'Unknown error in jsonrpc request',
					},
					method: request.method,
					...(request.params !== undefined ? { params: request.params } : {}),
					...(request.id !== undefined ? { id: request.id } : {}),
				}
			}
		},
	}
}
