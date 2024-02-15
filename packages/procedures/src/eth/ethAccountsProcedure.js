import { ethAccountsHandler } from '@tevm/actions'

/**
 * @param {ReadonlyArray<import('@tevm/utils').Account>} accounts
 * @returns {import('@tevm/procedures-types').EthAccountsJsonRpcProcedure}
 */
export const ethAccountsProcedure = (accounts) => async (req) => ({
	...(req.id ? { id: req.id } : {}),
	jsonrpc: '2.0',
	method: req.method,
	result: await ethAccountsHandler({ accounts })({}),
})
