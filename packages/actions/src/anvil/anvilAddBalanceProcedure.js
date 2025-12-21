import { anvilAddBalanceHandler } from './anvilAddBalanceHandler.js'

/**
 * Request handler for anvil_addBalance JSON-RPC requests.
 * Adds to an account's ETH balance (convenience method over anvil_setBalance).
 *
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./AnvilProcedure.js').AnvilAddBalanceProcedure}
 * @example
 * ```typescript
 * import { createTevmNode } from '@tevm/node'
 * import { anvilAddBalanceJsonRpcProcedure } from '@tevm/actions'
 *
 * const node = createTevmNode()
 * const procedure = anvilAddBalanceJsonRpcProcedure(node)
 *
 * // Add 1 ETH to an account
 * const result = await procedure({
 *   jsonrpc: '2.0',
 *   method: 'anvil_addBalance',
 *   params: ['0x1234567890123456789012345678901234567890', '0xde0b6b3a7640000'],
 *   id: 1
 * })
 * console.log(result.result) // null
 * ```
 */
export const anvilAddBalanceJsonRpcProcedure = (client) => {
	return async (request) => {
		const address = request.params[0]
		const amount = request.params[1]

		const result = await anvilAddBalanceHandler(client)({
			address,
			amount,
		})

		if (result.errors) {
			return {
				jsonrpc: '2.0',
				method: request.method,
				error: /** @type {any}*/ ({
					code: -32000,
					message: result.errors[0]?.message ?? 'Unknown error adding balance',
				}),
				...(request.id !== undefined ? { id: request.id } : {}),
			}
		}

		return {
			jsonrpc: '2.0',
			method: request.method,
			result: null,
			...(request.id !== undefined ? { id: request.id } : {}),
		}
	}
}
