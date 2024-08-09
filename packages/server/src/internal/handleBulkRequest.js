import { InternalError } from '@tevm/errors'

/**
 * Handles a bulk request. Does not throw returns errors as json-rpc error responses
 * @param {{request: import('@tevm/decorators').EIP1193RequestFn<any>} | import('@tevm/memory-client').MemoryClient} client
 * @param {ReadonlyArray<import("@tevm/jsonrpc").JsonRpcRequest<string, any>>} requests
 * @returns {Promise<ReadonlyArray<import("@tevm/jsonrpc").JsonRpcResponse<any, any, any>>>}
 * @throws {never} never throws
 */
export const handleBulkRequest = async (client, requests) => {
	const responses = await Promise.allSettled(
		requests.map((request) => {
			// no idea why ts is making me do this
			if ('transport' in client) {
				return client.request(/** @type any*/ (request))
			} else {
				return client.request(/** @type any*/ (request))
			}
		}),
	)
	return responses.map((response, i) => {
		const request = /** @type {import("@tevm/jsonrpc").JsonRpcRequest<string, object>} */ (requests[i])
		if (response.status === 'rejected') {
			if ('transport' in client && 'tevm' in client.transport) {
				client.transport.tevm?.logger?.error(response.reason)
			}
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
		return response.value
	})
}
