import { dumpStateHandler } from './dumpStateHandler.js'

/**
 * Creates a DumpState JSON-RPC Procedure for handling dumpState requests with Ethereumjs EVM
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./DumpStateJsonRpcProcedure.js').DumpStateJsonRpcProcedure}
 */
export const dumpStateProcedure = (client) => async (request) => {
	const { errors = [], ...result } = await dumpStateHandler(client)({
		throwOnFail: false,
	})

	if (errors.length > 0) {
		const error = /** @type {import('./TevmDumpStateError.js').TevmDumpStateError}*/ (errors[0])
		return {
			jsonrpc: '2.0',
			error: {
				code: error.code,
				message: error.message,
				data: {
					errors: errors.map(({ message }) => message),
				},
			},
			method: 'tevm_dumpState',
			...(request.id === undefined ? {} : { id: request.id }),
		}
	}
	return {
		jsonrpc: '2.0',
		result: {
			state: result.state,
		},
		method: 'tevm_dumpState',
		...(request.id === undefined ? {} : { id: request.id }),
	}
}
