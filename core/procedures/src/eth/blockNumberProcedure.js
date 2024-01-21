import { blockNumberHandler } from '@tevm/actions'
import { numberToHex } from 'viem'

/**
 * @param {import('@ethereumjs/blockchain').BlockchainInterface} blockchain
 * @returns {import('@tevm/procedures-spec').EthBlockNumberJsonRpcProcedure}
 */
export const blockNumberProcedure = (blockchain) => async (req) => ({
	...(req.id ? { id: req.id } : {}),
	jsonrpc: '2.0',
	method: req.method,
	result: await blockNumberHandler(blockchain)({}).then(numberToHex),
})
