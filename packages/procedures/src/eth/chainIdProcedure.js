import { chainIdHandler } from '@tevm/actions'
import { numberToHex } from '@tevm/utils'

/**
 * @param {import('@tevm/base-client').BaseClient} baseClient
 * @returns {import('./EthProcedure.js').EthChainIdJsonRpcProcedure}
 */
export const chainIdProcedure = (baseClient) => async (req) => ({
	...(req.id ? { id: req.id } : {}),
	jsonrpc: '2.0',
	method: req.method,
	// TODO pass in a client instead
	result: await chainIdHandler(baseClient)({}).then(numberToHex),
})
