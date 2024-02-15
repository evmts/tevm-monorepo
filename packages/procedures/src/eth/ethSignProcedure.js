import { ethSignHandler } from '@tevm/actions'

/**
 * @param {ReadonlyArray<import('@tevm/utils').HDAccount>} accounts
 * @returns {import('@tevm/procedures-types').EthSignJsonRpcProcedure}
 */
export const ethSignProcedure = (accounts) => async (req) => ({
	...(req.id ? { id: req.id } : {}),
	jsonrpc: '2.0',
	method: req.method,
	result: await ethSignHandler({ accounts })({
		address: req.params[0],
		data: req.params[1],
	}),
})
