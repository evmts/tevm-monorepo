/**
 * @deprecated
 * Makes a JSON-RPC request to a url
 * Returns the entire JSON-RPC response rather than throwing and only returning result
 * Used currently as an adapter to avoid refactoring existing code
 * @see https://ethereum.org/en/developers/docs/apis/json-rpc/
 * @param {{request: import('viem').EIP1193RequestFn}} client
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
				const result = await client.request(request)
				return {
					jsonrpc: '2.0',
					result,
					...(request.id !== undefined ? { id: request.id } : {}),
				}
			} catch (e) {
				if (typeof e === 'object' && e !== null && 'code' in e) {
					const message =
						'message' in e && typeof e.message === 'string' ? e.message : 'Unknown error in jsonrpc request'
					const code = typeof e.code === 'number' ? e.code : Number(e.code)
					return {
						jsonrpc: '2.0',
						error: {
							code: Number.isFinite(code) ? code : -32000,
							message,
							...('data' in e ? { data: e.data } : {}),
						},
						...(request.id !== undefined ? { id: request.id } : {}),
					}
				}
				return {
					jsonrpc: '2.0',
					error: {
						code: -32000,
						message: e instanceof Error ? e.message : 'Unknown error in jsonrpc request',
					},
					...(request.id !== undefined ? { id: request.id } : {}),
				}
			}
		},
	}
}
