/**
 * Makes a JSON-RPC request to a url
 * @see https://ethereum.org/en/developers/docs/apis/json-rpc/
 * @param {string} url to JSON RPC backend
 * @param {import("./HeadersInit.js").HeadersInit} headers to send with the request
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
export const createJsonRpcFetcher = (
	url,
	headers = {
		Referer: 'https://tevm.sh',
	},
) => {
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
				headers: /** @type any*/ ({
					'content-type': 'application/json',
					...headers,
				}),
				method: 'POST',
				body: data,
			})
			if (!res.ok) {
				throw new Error(
					`JSONRpcError: ${JSON.stringify(
						{
							method: request.method,
							status: res.status,
							message: await (
								res.text ??
								(() => {
									return Promise.reject('no text defined')
								})
							)()
								.catch(async () => {
									return res.json().then((resJson) => {
										return JSON.stringify(/** @type any*/ (resJson).error)
									})
								})
								.catch(() => {
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
				console.log(out)
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
				// TODO do more validation and remove this typecast
				return /**@type any*/ (out)
			} catch (e) {
				console.error(e)
				throw new Error('JSON-RPC response was not valid JSON')
			}
		},
	}
}
