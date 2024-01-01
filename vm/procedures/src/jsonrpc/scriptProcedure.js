import { scriptHandler } from '../index.js'

/**
 * Creates a Script JSON-RPC Procedure for handling script requests with Ethereumjs EVM
 * @param {import('@ethereumjs/evm').EVM} evm
 * @returns {import('@tevm/api').ScriptJsonRpcProcedure}
 */
export const scriptProcedure = (evm) => async (request) => {
	/**
	 * @type {import('@tevm/api').ScriptResult}
	 */
	let res
	try {
		res = await scriptHandler(evm)(request.params)
	} catch (e) {
		const tevmError = /** @type {import('@tevm/api').ScriptError} */ (e)
		return {
			jsonrpc: '2.0',
			method: 'tevm_script',
			error: {
				code: tevmError._tag ?? 'UnexpectedError',
				message: tevmError._tag ?? 'An unexpected unhandled error occurred',
			},
			...(request.id === undefined ? {} : { id: request.id }),
		}
	}
	const { errors = [], data, ...result } = res
	if (errors.length > 0) {
		const error = /** @type {import('@tevm/api').ScriptError}*/ (errors[0])
		return {
			jsonrpc: '2.0',
			error: {
				code: error._tag,
				message: error.message,
				data: {
					errors: errors.map(({ message }) => message),
				},
			},
			method: 'tevm_script',
			...(request.id === undefined ? {} : { id: request.id }),
		}
	}
	return {
		jsonrpc: '2.0',
		result: {
			data: /** @type any */ (data),
			...result,
		},
		method: 'tevm_script',
		...(request.id === undefined ? {} : { id: request.id }),
	}
}
