import { callHandler } from '../index.js'

/**
 * Creates a Call JSON-RPC Procedure for handling call requests with Ethereumjs EVM
 * @param {import('@ethereumjs/evm').EVM} evm
 * @returns {import('@tevm/api').CallJsonRpcProcedure}
 */
export const callProcedure = (evm) => async (request) => {
	const { errors = [], ...result } = await callHandler(evm)(request.params)
	if (errors.length > 0) {
		const error = /** @type {import('@tevm/api').CallError}*/ (errors[0])
		return {
			jsonrpc: '2.0',
			error: {
				code: error._tag,
				message: error.message,
				data: {
					errors: errors.map(({ message }) => message),
				},
			},
			method: 'tevm_call',
			...(request.id === undefined ? {} : { id: request.id }),
		}
	}
	return {
		jsonrpc: '2.0',
		result,
		method: 'tevm_call',
		...(request.id === undefined ? {} : { id: request.id }),
	}
}
