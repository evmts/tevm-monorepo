import { numberToHex } from '@tevm/utils'
import { chainIdHandler } from './chainIdHandler.js'

/**
 * @param {import('@tevm/node').TevmNode} baseClient
 * @returns {import('./EthProcedure.js').EthChainIdJsonRpcProcedure}
 */
export const chainIdProcedure = (baseClient) => async (req) => {
	try {
		// TODO pass in a client instead
		const result = await chainIdHandler(baseClient)({}).then(numberToHex)
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
