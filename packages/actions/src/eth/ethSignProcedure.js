import { ethSignHandler } from './ethSignHandler.js'

/**
 * @param {ReadonlyArray<import('@tevm/utils').HDAccount | import('@tevm/utils').NativeHDAccount>} accounts
 * @returns {import('./EthProcedure.js').EthSignJsonRpcProcedure}
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
