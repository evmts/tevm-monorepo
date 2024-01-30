import { ethSignHandler } from '@tevm/actions'

/**
 * @param {ReadonlyArray<import('viem/accounts').HDAccount>} options
 * @returns {import('@tevm/procedures-types').EthSignJsonRpcProcedure}
 */
export const ethSignProcedure = (options) => async (req) => ({
	...(req.id ? { id: req.id } : {}),
	jsonrpc: '2.0',
	method: req.method,
	result: await ethSignHandler(options)({
		address: req.params[0],
		data: req.params[1],
	}),
})
