import { ethSubscribeHandler } from './ethSubscribeHandler.js'

/**
 * Request handler for eth_subscribe JSON-RPC requests.
 * Creates a subscription for various Ethereum events.
 *
 * @param {import('@tevm/node').TevmNode} tevmNode
 * @returns {import('./EthProcedure.js').EthSubscribeJsonRpcProcedure}
 * @example
 * ```typescript
 * import { createTevmNode } from '@tevm/node'
 * import { ethSubscribeProcedure } from '@tevm/actions'
 *
 * const client = createTevmNode()
 * const procedure = ethSubscribeProcedure(client)
 *
 * const response = await procedure({
 *   jsonrpc: '2.0',
 *   method: 'eth_subscribe',
 *   params: ['newHeads'],
 *   id: 1
 * })
 * console.log(response.result) // '0x1'
 * ```
 */
export const ethSubscribeJsonRpcProcedure = (tevmNode) => {
	return async (request) => {
		const subscribeRequest = /** @type {import('./EthJsonRpcRequest.js').EthSubscribeJsonRpcRequest}*/ (request)

		tevmNode.logger.debug(subscribeRequest, 'ethSubscribeJsonRpcProcedure: handling request')

		try {
			// Parse params based on subscription type
			const [subscriptionType, filterParams] = subscribeRequest.params

			/** @type {import('./EthSubscribeParams.js').EthSubscribeParams} */
			let params

			switch (subscriptionType) {
				case 'newHeads':
					params = { subscriptionType: 'newHeads' }
					break
				case 'logs':
					params = /** @type {import('./EthSubscribeParams.js').EthSubscribeLogsParams} */ ({
						subscriptionType: 'logs',
						...(filterParams !== undefined ? { filterParams } : {}),
					})
					break
				case 'newPendingTransactions':
					params = { subscriptionType: 'newPendingTransactions' }
					break
				case 'syncing':
					params = { subscriptionType: 'syncing' }
					break
				default:
					throw new Error(`Unknown subscription type: ${subscriptionType}`)
			}

			const result = await ethSubscribeHandler(tevmNode)(params)

			tevmNode.logger.debug({ subscriptionId: result }, 'ethSubscribeJsonRpcProcedure: subscription created')

			return {
				jsonrpc: request.jsonrpc,
				method: request.method,
				result,
				...(request.id !== undefined ? { id: request.id } : {}),
			}
		} catch (e) {
			tevmNode.logger.error(e, 'ethSubscribeJsonRpcProcedure: error')
			const { code, message } = /** @type {import('./ethSubscribeHandler.js').EthSubscribeError}*/ (e)
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
