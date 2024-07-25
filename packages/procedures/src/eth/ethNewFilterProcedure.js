import { ethNewFilterHandler } from '@tevm/actions'

/**
 * Request handler for eth_newFilter JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} tevmNode
 * @returns {import('./EthProcedure.js').EthNewFilterJsonRpcProcedure}
 */
export const ethNewFilterJsonRpcProcedure = (tevmNode) => {
	return async (request) => {
		const newFilterRequest = /** @type {import('./EthJsonRpcRequest.js').EthNewFilterJsonRpcRequest}*/ (request)
		try {
			return {
				jsonrpc: request.jsonrpc,
				method: request.method,
				result: await ethNewFilterHandler(tevmNode)(newFilterRequest.params[0]),
				...(request.id !== undefined ? { id: request.id } : {}),
			}
		} catch (e) {
			tevmNode.logger.error(e)
			const { code, message } = /** @type {import('@tevm/actions').EthNewFilterError}*/ (e)
			return {
				error: {
					code,
					message,
				},
				method: request.method,
				jsonrpc: request.jsonrpc,
				...(request.id !== undefined ? { id: request.id } : {}),
			}
		}
	}
}
