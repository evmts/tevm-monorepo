import { numberToHex } from '@tevm/utils'
import { blockNumberHandler } from './blockNumberHandler.js'

/**
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./EthProcedure.js').EthBlockNumberJsonRpcProcedure}
 */
export const blockNumberProcedure = (client) => async (req) => ({
	...(req.id ? { id: req.id } : {}),
	jsonrpc: '2.0',
	method: req.method,
	result: await blockNumberHandler(client)({}).then(numberToHex),
})
