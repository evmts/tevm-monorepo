import { NoProxyConfiguredError, ProxyFetchError } from './errors/index.js'
import { createJsonRpcFetcher } from '@tevm/jsonrpc'

/**
 * Given a url it returns a handler that proxys a request to the given url
 * @param {string} [url]
 * @example
 * ```js
 *
 * const proxy = proxyRequest('http://localhost:8545')
 * const response = await proxy({
 *   method: 'eth_chainId',
 *   id: 1,
 *   jsonrpc: '2.0',
 *   params: [],
 * })
 * console.log(response) // { id: 1, jsonrpc: '2.0', result: '0x1' }
 * ```
 */
export const proxyRequest = (url) => {
	/**
	 * @param {import('@tevm/api').TevmJsonRpcRequest | import('@tevm/api').JsonRpcRequest<string, unknown> | import('@tevm/api').JsonRpcRequest<string, readonly []>} request
	 * @returns {Promise<import('@tevm/api').JsonRpcResponse<any, any, any>>}
	 */
	return async (request) => {
		if (!url) {
			const err = new NoProxyConfiguredError(request.method)
			console.error(err)
			return {
				...(request.id === undefined ? { id: request.id } : {}),
				method: request.method,
				jsonrpc: '2.0',
				error: {
					code: err._tag,
					message: err.message,
				},
			}
		}
		return createJsonRpcFetcher(url)
			.request(request)
			.catch((e) => {
				console.error('\n\n\n\n', 'error is here', e, '\n\n\n\n')
				const err = new ProxyFetchError(request.method)
				console.error(err)
				return {
					...(request.id === undefined ? { id: request.id } : {}),
					method: request.method,
					jsonrpc: '2.0',
					error: {
						code: err._tag,
						message: err.message,
					},
				}
			})
	}
}
