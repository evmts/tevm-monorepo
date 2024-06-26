import { getStorageAtHandler } from '@tevm/actions'

/**
 * @param {Parameters<typeof getStorageAtHandler>[0]} options
 * @returns {import('./EthProcedure.js').EthGetStorageAtJsonRpcProcedure}
 */
export const getStorageAtProcedure =
	({ getVm, forkClient }) =>
	async (req) => ({
		...(req.id ? { id: req.id } : {}),
		jsonrpc: '2.0',
		method: req.method,
		result: await getStorageAtHandler({ getVm, forkClient })({
			address: req.params[0],
			position: req.params[1],
			blockTag: req.params[2],
		}),
	})
