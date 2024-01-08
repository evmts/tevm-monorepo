import { NoProxyConfiguredError } from './NoProxyConfiguredError.js'
import { ProxyFetchError } from './ProxyFetchError.js'
import { createJsonRpcFetcher } from '@tevm/jsonrpc'

/**
 * Proxys a request to the given url
 * @param {string} [url]
 */
export const proxyRequest = (url) => {
	/**
	 * @param {import('@tevm/api').TevmJsonRpcRequest | import('@tevm/api').JsonRpcRequest<string, object>} request
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
