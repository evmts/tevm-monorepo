import { getStorageAtHandler } from './getStorageAtHandler.js';

/**
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./EthProcedure.js').EthGetStorageAtJsonRpcProcedure}
 */
export const getStorageAtProcedure = (client) => async (req) => ({
	...(req.id ? { id: req.id } : {}),
	jsonrpc: '2.0',
	method: req.method,
	result: await getStorageAtHandler(client)({
		address: req.params[0],
		position: req.params[1],
		blockTag: req.params[2],
	}),
})
