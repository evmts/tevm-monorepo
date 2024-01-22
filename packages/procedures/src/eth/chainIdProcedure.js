import { chainIdHandler } from '@tevm/actions'
import { numberToHex } from 'viem'

/**
 * @param {bigint} chainId
 * @returns {import('@tevm/procedures-types').EthChainIdJsonRpcProcedure}
 */
export const chainIdProcedure = (chainId) => async (req) => ({
	...(req.id ? { id: req.id } : {}),
	jsonrpc: '2.0',
	method: req.method,
	result: await chainIdHandler(chainId)({}).then(numberToHex),
})
