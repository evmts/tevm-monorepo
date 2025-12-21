import { ethUnsubscribeHandler } from './ethUnsubscribeHandler.js'

/**
 * Request handler for eth_unsubscribe JSON-RPC requests.
 * Cancels an active subscription.
 *
 * @param {import('@tevm/node').TevmNode} tevmNode
 * @returns {import('./EthProcedure.js').EthUnsubscribeJsonRpcProcedure}
 * @example
 * ```typescript
 * import { createTevmNode } from '@tevm/node'
 * import { ethUnsubscribeProcedure } from '@tevm/actions'
 *
 * const client = createTevmNode()
 * const procedure = ethUnsubscribeProcedure(client)
 *
 * const response = await procedure({
 *   jsonrpc: '2.0',
 *   method: 'eth_unsubscribe',
 *   params: ['0x1'],
 *   id: 1
 * })
 * console.log(response.result) // true
 * ```
 */
export const ethUnsubscribeJsonRpcProcedure = (tevmNode) => {
	return async (request) => {
		const unsubscribeRequest = /** @type {import('./EthJsonRpcRequest.js').EthUnsubscribeJsonRpcRequest}*/ (request)

		tevmNode.logger.debug(unsubscribeRequest, 'ethUnsubscribeJsonRpcProcedure: handling request')

		try {
			const [subscriptionId] = unsubscribeRequest.params
			const result = await ethUnsubscribeHandler(tevmNode)({ subscriptionId })

			tevmNode.logger.debug({ subscriptionId, result }, 'ethUnsubscribeJsonRpcProcedure: unsubscribe completed')

			return {
				jsonrpc: request.jsonrpc,
				method: request.method,
				result,
				...(request.id !== undefined ? { id: request.id } : {}),
			}
		} catch (e) {
			tevmNode.logger.error(e, 'ethUnsubscribeJsonRpcProcedure: error')
			const error = /** @type {Error & {code?: number}}*/ (e)
			return {
				error: {
					code: error.code ?? -32603,
					message: error.message,
				},
				method: request.method,
				jsonrpc: request.jsonrpc,
				...(request.id !== undefined ? { id: request.id } : {}),
			}
		}
	}
}
