import { MethodNotFoundError } from '@tevm/errors'
import { createHandlers } from './createHandlers.js'

/**
 * Request handler for JSON-RPC requests.
 *
 * This implementation of the Tevm requestProcedure spec
 * implements it via the ethereumjs VM.
 *
 * Most users will want to use `Tevm.request` instead of
 * this method but this method may be desired if hyper optimizing
 * bundle size.
 *
 * @param {import('@tevm/base-client').BaseClient} client
 * @returns {import('./tevm-request-handler/TevmJsonRpcRequestHandler.js').TevmJsonRpcRequestHandler}
 * @example
 * ```typescript
 * const blockNumberResponse = await tevm.request({
 *  method: 'eth_blockNumber',
 *  params: []
 *  id: 1
 *  jsonrpc: '2.0'
 * })
 * const accountResponse = await tevm.request({
 *  method: 'tevm_getAccount',
 *  params: [{address: '0x123...'}]
 *  id: 1
 *  jsonrpc: '2.0'
 * })
 * ```
 */
export const requestProcedure = (client) => {
	const allHandlers = createHandlers(client)
	return async (request) => {
		await client.ready()
		client.logger.debug(request, 'JSON-RPC request received')
		if (!(request.method in allHandlers)) {
			const err = new MethodNotFoundError(`UnsupportedMethodError: Unknown method ${/**@type any*/ (request).method}`)
			return /** @type {any}*/ ({
				id: /** @type any*/ (request).id ?? null,
				method: /** @type any*/ (request).method,
				jsonrpc: '2.0',
				error: {
					code: err.code,
					message: err.message,
				},
			})
		}
		return allHandlers[/** @type {keyof typeof allHandlers}*/ (request.method)](client)(request)
	}
}
