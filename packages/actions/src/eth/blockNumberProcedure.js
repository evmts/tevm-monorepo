import { numberToHex } from '@tevm/utils'
import { blockNumberHandler } from './blockNumberHandler.js'

/**
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./EthProcedure.js').EthBlockNumberJsonRpcProcedure}
 */
export const blockNumberProcedure = (client) => async (req) => {
	try {
		const result = await blockNumberHandler(client)({}).then(numberToHex)
		return {
			...(req.id ? { id: req.id } : {}),
			jsonrpc: '2.0',
			method: req.method,
			result,
		}
	} catch (error) {
		return {
			...(req.id ? { id: req.id } : {}),
			jsonrpc: '2.0',
			method: req.method,
			error: {
				code: -32000,
				message: error instanceof Error ? error.message : String(error),
			},
		}
	}
}
