/**
 * @typedef {(request: import("@tevm/api").JsonRpcRequest<any, any>) => Promise<import("@tevm/api").JsonRpcResponse<any, any, any>>} JsonRpcFetch
 */

/**
 * Makes a JSON-RPC request to a url
 * @see https://ethereum.org/en/developers/docs/apis/json-rpc/
 * @param {string} url to JSON RPC backend
 * @returns {import("./JsonRpcClient.js").JsonRpcClient} the `result` field from the JSON-RPC response
 * @example
 * ```typescript
 * const url = 'https://mainnet.optimism.io'
 * const params = {
 *   method: 'eth_getBlockByNumber',
 *   params: ['latest', false],
 * }
 * const {result: block} = await fetchJsonRpc(url, params)
 */
export const createJsonRpcFetcher = (url) => {
	return {
		url,
		request: async (request) => {
			const data = JSON.stringify({
				method: request.method,
				params: request.params,
				jsonrpc: '2.0',
				id: 1,
			})
			const res = await fetch(url, {
				headers: {
					'content-type': 'application/json',
					// Identify ourselves!
					Referer: 'foo',
				},
				method: 'POST',
				body: data,
			})
			if (!res.ok) {
				throw new Error(
					`JSONRpcError: ${JSON.stringify(
						{
							method: request.method,
							status: res.status,
							message: await res.text().catch(() => {
								return 'Could not parse error message likely because of a network error'
							}),
						},
						null,
						2,
					)}`,
				)
			}
			try {
				const out = await res.json()
				if (typeof out !== 'object') {
					throw new Error('JSON-RPC response was not an object')
				}
				if (out === null) {
					throw new Error('JSON-RPC response was null')
				}
				if (
					'id' in out &&
					!(
						typeof out.id === 'number' ||
						typeof out.id === 'string' ||
						out.id === null
					)
				) {
					throw new Error(
						'JSON-RPC response was missing an id or id is invalid type',
					)
				}
				if (!('jsonrpc' in out) || out.jsonrpc !== '2.0') {
					throw new Error('JSON-RPC response was missing a jsonrpc field')
				}
				if (!('method' in out) || typeof out.method !== 'string') {
					throw new Error('JSON-RPC response was missing a method field')
				}
				// TODO do more validation and remove this typecast
				return /**@type any*/ (out)
			} catch (e) {
				console.error(e)
				throw new Error('JSON-RPC response was not valid JSON')
			}
		},
	}
}
