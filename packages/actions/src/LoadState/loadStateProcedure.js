import { loadStateHandler } from './loadStateHandler.js'

/**
 * Creates a LoadState JSON-RPC Procedure for handling LoadState requests with Ethereumjs EVM
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./LoadStateJsonRpcProcedure.js').LoadStateJsonRpcProcedure}
 */
export const loadStateProcedure = (client) => async (request) => {
	const {
		params: [{ state }],
	} = request

	const { errors = [] } = await loadStateHandler(client)({
		state: state,
		throwOnFail: false,
	})

	if (errors.length > 0) {
		const error = /** @type {import('./TevmLoadStateError.js').TevmLoadStateError}*/ (errors[0])
		return {
			jsonrpc: '2.0',
			error: {
				code: error.code,
				message: error.message,
				data: {
					errors: errors.map(({ message }) => message),
				},
			},
			method: 'tevm_loadState',
			...(request.id === undefined ? {} : { id: request.id }),
		}
	}
	return {
		jsonrpc: '2.0',
		result: {},
		method: 'tevm_loadState',
		...(request.id === undefined ? {} : { id: request.id }),
	}
}
