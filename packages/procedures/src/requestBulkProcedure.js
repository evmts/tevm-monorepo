import { requestProcedure } from './requestProcedure.js'

/**
 * @param {import('@tevm/vm').TevmVm} vm
 * @returns {import('@tevm/procedures-types').TevmJsonRpcBulkRequestHandler}
 */
export const requestBulkProcedure = (vm) => async (requests) => {
	const handleRequest = requestProcedure(vm)
	const responses = await Promise.allSettled(
		requests.map((request) => handleRequest(/** @type any*/ (request))),
	)
	return responses.map((response, i) => {
		const request =
			/** @type {import("@tevm/jsonrpc").JsonRpcRequest<string, object>} */ (
				requests[i]
			)
		// this should never happen
		if (response.status === 'rejected') {
			console.error(response.reason)
			return {
				id: request.id,
				method: request.method,
				jsonrpc: '2.0',
				error: {
					// TODO This should be added to @tevm/errors package and rexported in tevm
					code: 'UnexpectedBulkRequestError',
					message: 'UnexpectedBulkRequestError',
				},
			}
		}
		return response.value
	})
}
