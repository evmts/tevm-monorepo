import { UnexpectedInternalServerError } from './errors/index.js'
import { proxyRequest } from './proxyRequest.js'
import { requestProcedure } from '@tevm/procedures'

/**
 * @param {import('@ethereumjs/vm').VM} vm
 * @param {string} [proxyUrl]
 * @returns {import('@tevm/api').TevmJsonRpcRequestHandler}
 */
export const processRequest = (vm, proxyUrl) => {
	return (request) => {
		try {
			if (!request.method.startsWith('tevm_')) {
				return proxyRequest(proxyUrl)(request)
			}
			return requestProcedure(vm)(/**@type any*/ (request))
		} catch (e) {
			console.error(e)
			const err = new UnexpectedInternalServerError(request.method)
			console.error(err)
			return Promise.resolve({
				id: request.id ?? null,
				method: request.method,
				jsonrpc: '2.0',
				error: {
					code: err._tag,
					message: err.message,
				},
			})
		}
	}
}
