import { UnexpectedInternalServerError } from './UnexpectedInternalServerError.js'
import { proxyRequest } from './proxyRequest.js'
import { requestProcedure } from '@tevm/procedures'

/**
 * @param {import('@ethereumjs/evm').EVM} evm
 * @param {string} [proxyUrl]
 */
export const processRequest = (evm, proxyUrl) => {
	/**
	 * @param {import('@tevm/api').TevmJsonRpcRequest | import('@tevm/api').JsonRpcRequest<string, object>} request
	 */
	return async (request) => {
		if (!request.method.startsWith('tevm_')) {
			const res = proxyRequest(proxyUrl)(request)
			console.log('fetch proxy', {
				request,
				proxyUrl,
				res,
			})
			return res
		}
		try {
			return requestProcedure(evm)(/**@type any*/ (request))
		} catch (e) {
			console.error(e)
			const err = new UnexpectedInternalServerError(request.method)
			console.error(err)
			return {
				id: request.id ?? null,
				method: request.method,
				jsonrpc: '2.0',
				error: {
					code: err._tag,
					message: err.message,
				},
			}
		}
	}
}
