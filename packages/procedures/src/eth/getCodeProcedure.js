import { getCodeHandler } from '@tevm/actions'

/**
 * @param {Parameters<typeof getCodeHandler>[0]} options
 * @returns {import('@tevm/procedures-types').EthGetCodeJsonRpcProcedure}
 */
export const getCodeProcedure =
	({ stateManager, forkUrl }) =>
	async (req) => ({
		...(req.id ? { id: req.id } : {}),
		jsonrpc: '2.0',
		method: req.method,
		result: await getCodeHandler({ stateManager, forkUrl })({
			address: req.params[0],
			tag: req.params[1],
		}),
	})
