import { getCodeHandler } from '@tevm/actions'

/**
 * @param {Parameters<typeof getCodeHandler>[0]} options
 * @returns {import('@tevm/procedures').EthGetCodeJsonRpcProcedure}
 */
export const getCodeProcedure =
	({ getVm, forkClient }) =>
	async (req) => ({
		...(req.id ? { id: req.id } : {}),
		jsonrpc: '2.0',
		method: req.method,
		result: await getCodeHandler({ getVm, forkClient })({
			address: req.params[0],
			blockTag: req.params[1],
		}),
	})
