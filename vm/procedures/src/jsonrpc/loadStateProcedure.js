import { loadStateHandler } from '../index.js'

/**
 * Creates a DumpState JSON-RPC Procedure for handling dumpState requests with Ethereumjs EVM
 * @param {import('@tevm/state').TevmStateManager} stateManager
 * @returns {import('@tevm/api').LoadStateJsonRpcProcedure}
 */
export const loadStateProcedure = (stateManager) => async (request) => {
	const {
		params: { state },
	} = request

	await loadStateHandler(stateManager)({ state: state })

	return {
		jsonrpc: '2.0',
		error: {
			code: 'InvalidRequestError',
			message: 'Invalid request',
		},
		method: 'tevm_load_state',
		...(request.id === undefined ? {} : { id: request.id }),
	}
}
