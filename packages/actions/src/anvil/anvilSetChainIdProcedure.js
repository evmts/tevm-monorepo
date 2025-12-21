import { MethodNotSupportedError } from '@tevm/errors'
import { hexToNumber } from '@tevm/utils'

/**
 * Request handler for anvil_setChainId JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./AnvilProcedure.js').AnvilSetChainIdProcedure}
 */
export const anvilSetChainIdJsonRpcProcedure = (client) => {
	return async (request) => {
		const chainId = hexToNumber(request.params[0])
		if (!Number.isInteger(chainId) || chainId <= 0) {
			return {
				...(request.id ? { id: request.id } : {}),
				method: request.method,
				jsonrpc: request.jsonrpc,
				error: {
					code: /** @type any*/ (-32602),
					message: `Invalid id ${chainId}. Must be a positive integer.`,
				},
			}
		}
		const err = new MethodNotSupportedError(
			'anvil_setChainId is not supported. Chain ID is set at node creation time and cannot be changed at runtime.',
		)
		client.logger.error(err)
		return /**@type any*/ ({
			id: /** @type any*/ (request).id,
			jsonrpc: '2.0',
			error: {
				code: err._tag,
				message: err.message,
			},
		})
	}
}
