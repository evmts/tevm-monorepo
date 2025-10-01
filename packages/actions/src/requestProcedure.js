import { MethodNotFoundError } from '@tevm/errors'
import { createHandlers } from './createHandlers.js'

/**
 * Request handler for JSON-RPC requests to Tevm.
 *
 * This implementation of the Tevm requestProcedure spec
 * implements it via the ethereumjs VM.
 *
 * @param {import('@tevm/node').TevmNode} client
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
 * @see {@link createHandlers} where handlers are defined
 */
export const requestProcedure = (client) => {
	const handlers = createHandlers(client)
	return async (request) => {
		await client.ready()
		client.logger.debug({ request }, 'JSON-RPC request received')
		if (!(request.method in handlers)) {
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
		return handlers[/** @type {keyof typeof handlers}*/ (request.method)](request)
	}
}
