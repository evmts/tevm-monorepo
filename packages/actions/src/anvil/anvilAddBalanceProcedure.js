import { anvilAddBalanceHandler } from './anvilAddBalanceHandler.js'

/**
 * Request handler for anvil_addBalance JSON-RPC requests.
 * Adds to an account's ETH balance (convenience method over anvil_setBalance).
 *
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./AnvilProcedure.js').AnvilAddBalanceProcedure}
 */
export const anvilAddBalanceJsonRpcProcedure = (client) => {
	return async (request) => {
		const address = request.params[0]
		const amount = request.params[1]

		try {
			await anvilAddBalanceHandler(client)({
				address,
				amount,
			})

			return {
				jsonrpc: '2.0',
				method: request.method,
				result: null,
				...(request.id !== undefined ? { id: request.id } : {}),
			}
		} catch (error) {
			return {
				jsonrpc: '2.0',
				method: request.method,
				error: /** @type {any}*/ ({
					code: '-32000',
					message: error instanceof Error ? error.message : 'Unknown error adding balance',
				}),
				...(request.id !== undefined ? { id: request.id } : {}),
			}
		}
	}
}
