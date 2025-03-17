import { tevmSend } from '@tevm/decorators'
import { InternalError } from '@tevm/errors'

/**
 * Handles a bulk request. Does not throw returns errors as json-rpc error responses
 * @param {import('../Client.js').Client} client
 * @param {ReadonlyArray<import("@tevm/jsonrpc").JsonRpcRequest<string, any>>} requests
 * @returns {Promise<ReadonlyArray<import("@tevm/jsonrpc").JsonRpcResponse<any, any, any>>>}
 * @throws {never} never throws
 */
export const handleBulkRequest = async (client, requests) => {
	const { send } = client.transport.tevm.extend(tevmSend())
	const responses = await Promise.allSettled(
		requests.map((request) => {
			return send(/** @type any*/ (request))
		}),
	)
	return responses.map((response, i) => {
		const request = /** @type {import("@tevm/jsonrpc").JsonRpcRequest<string, object>} */ (requests[i])
		if (response.status === 'rejected') {
			client.transport.tevm.logger.error(response.reason)
			const err = new InternalError(request.method, { cause: response.reason })
			return {
				...(request.id !== undefined ? { id: request.id } : {}),
				method: request.method,
				jsonrpc: '2.0',
				error: {
					code: err.code,
					message: err.message,
				},
			}
		}
		// No need to handle BigInt serialization here as it's handled in createHttpHandler.js
		return response.value
	})
}