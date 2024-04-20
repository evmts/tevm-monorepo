import { chainIdHandler } from '@tevm/actions'
import { numberToHex } from '@tevm/utils'

/**
 * @param {() => Promise<number>} getChainId
 * @returns {import('@tevm/procedures-types').EthChainIdJsonRpcProcedure}
 */
export const chainIdProcedure = (getChainId) => async (req) => ({
	...(req.id ? { id: req.id } : {}),
	jsonrpc: '2.0',
	method: req.method,
	// TODO pass in a client instead
	result: await chainIdHandler(/** @type any*/ ({ getChainId }))({}).then(numberToHex),
})
