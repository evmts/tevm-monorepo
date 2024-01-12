import { dumpStateHandler } from '../index.js'

/**
 * Creates a DumpState JSON-RPC Procedure for handling dumpState requests with Ethereumjs EVM
 * @param {import('@tevm/state').TevmStateManager} stateManager
 * @returns {import('@tevm/api').DumpStateJsonRpcProcedure}
 */
export const dumpStateProcedure = (stateManager) => async (request) => {
	const result = await dumpStateHandler(stateManager)()

	return {
		jsonrpc: '2.0',
		result,
		method: 'tevm_dump_state',
		...(request.id === undefined ? {} : { id: request.id }),
	}
}
