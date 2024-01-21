import { chainIdHandler } from '../../handlers/index.js'
import { numberToHex } from 'viem'

/**
 * @param {bigint} chainId
 * @returns {import('@tevm/api').EthChainIdJsonRpcProcedure}
 */
export const chainIdProcedure = (chainId) => async (req) => ({
	...(req.id ? { id: req.id } : {}),
	jsonrpc: '2.0',
	method: req.method,
	result: await chainIdHandler(chainId)({}).then(numberToHex),
})
