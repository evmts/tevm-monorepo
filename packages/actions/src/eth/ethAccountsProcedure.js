import { ethAccountsHandler } from './ethAccountsHandler.js';

/**
 * @param {ReadonlyArray<import('@tevm/utils').Account>} accounts
 * @returns {import('./EthProcedure.js').EthAccountsJsonRpcProcedure}
 */
export const ethAccountsProcedure = (accounts) => async (req) => ({
	...(req.id ? { id: req.id } : {}),
	jsonrpc: '2.0',
	method: req.method,
	result: await ethAccountsHandler({ accounts })({}),
})
