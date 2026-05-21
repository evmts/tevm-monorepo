import { MethodNotFoundError, MethodNotSupportedError } from '@tevm/errors'
import { createHandlers } from './createHandlers.js'
import { isBlockedMethod, rpcMethodStatusByMethod } from './rpcMethodMatrix.js'

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
		const method = /** @type {string} */ (request.method)
		const isLightPreReadyAllowed =
			client.consensus?.mode === 'light-client' &&
			(method === 'eth_chainId' || method === 'tevm_lightSyncStatus' || method === 'zevm_lightSyncStatus')
		if (!isLightPreReadyAllowed) {
			await client.ready()
		}
		client.logger.debug({ request }, 'JSON-RPC request received')
		if (!(method in handlers)) {
			if (isBlockedMethod(method)) {
				const err = new MethodNotSupportedError(
					`UnsupportedMethodError: Method ${/** @type any*/ (request).method} is blocked by scope`,
				)
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
			if (rpcMethodStatusByMethod.get(method) === 'missing') {
				const err = new MethodNotFoundError(
					`UnimplementedMethodError: Method ${/** @type any*/ (request).method} is typed but not yet implemented`,
				)
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
		return /** @type {(request: any) => any} */ (handlers[/** @type {keyof typeof handlers} */ (method)])(request)
	}
}
