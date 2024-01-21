import { getStorageAtHandler } from '@tevm/actions'

/**
 * @param {Parameters<typeof getStorageAtHandler>[0]} options
 * @returns {import('@tevm/procedures-types').EthGetStorageAtJsonRpcProcedure}
 */
export const getStorageAtProcedure =
	({ stateManager, forkUrl }) =>
	async (req) => ({
		...(req.id ? { id: req.id } : {}),
		jsonrpc: '2.0',
		method: req.method,
		result: await getStorageAtHandler({ stateManager, forkUrl })({
			address: req.params[0],
			tag: req.params[2],
			position: req.params[1],
		}),
	})
