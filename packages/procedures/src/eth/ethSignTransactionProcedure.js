import { ethSignTransactionHandler } from '@tevm/actions'
import { hexToBigInt } from '@tevm/utils'

/**
 * @param {Parameters<typeof ethSignTransactionHandler>[0]} options
 * @returns {import('@tevm/procedures-types').EthSignTransactionJsonRpcProcedure}
 */
export const ethSignTransactionProcedure = (options) => async (req) => ({
	...(req.id ? { id: req.id } : {}),
	jsonrpc: '2.0',
	method: req.method,
	result: await ethSignTransactionHandler(options)({
		from: req.params[0].from,
		...(req.params[0].to ? { to: req.params[0].to } : {}),
		...(req.params[0].data ? { data: req.params[0].data } : {}),
		...(req.params[0].value ? { value: hexToBigInt(req.params[0].value) } : {}),
		...(req.params[0].gas ? { gas: hexToBigInt(req.params[0].gas) } : {}),
		...(req.params[0].gasPrice
			? { gasPrice: hexToBigInt(req.params[0].gasPrice) }
			: {}),
		...(req.params[0].nonce ? { nonce: hexToBigInt(req.params[0].nonce) } : {}),
	}),
})
