import { getCodeHandler } from './getCodeHandler.js'

/**
 * @param {Parameters<typeof getCodeHandler>[0]} baseClient
 * @returns {import('./EthProcedure.js').EthGetCodeJsonRpcProcedure}
 */
export const getCodeProcedure = (baseClient) => async (req) => ({
	...(req.id ? { id: req.id } : {}),
	jsonrpc: '2.0',
	method: req.method,
	result: await getCodeHandler(baseClient)({
		address: req.params[0],
		blockTag: req.params[1],
	}),
})
