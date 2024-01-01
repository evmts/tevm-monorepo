import { contractHandler } from '../index.js'

/**
 * Creates a Contract JSON-RPC Procedure for handling contract requests with Ethereumjs EVM
 * @param {import('@ethereumjs/evm').EVM} evm
 * @returns {import('@tevm/api').ContractJsonRpcProcedure}
 */
export const contractProcedure = (evm) => async (request) => {
	/**
	 * @type {import('@tevm/api').ContractResult}
	 */
	let res
	try {
		res = await contractHandler(evm)(request.params)
	} catch (e) {
		const tevmError = /** @type {import('@tevm/api').ContractError} */ (e)
		return {
			jsonrpc: '2.0',
			method: 'tevm_contract',
			error: {
				code: tevmError._tag ?? 'UnexpectedError',
				message: tevmError._tag ?? 'An unexpected unhandled error occurred',
			},
			...(request.id === undefined ? {} : { id: request.id }),
		}
	}
	const { errors = [], data, ...result } = res
	if (errors.length > 0) {
		const error = /** @type {import('@tevm/api').ContractError}*/ (errors[0])
		return {
			jsonrpc: '2.0',
			error: {
				code: error._tag,
				message: error.message,
				data: {
					errors: errors.map(({ message }) => message),
				},
			},
			method: 'tevm_contract',
			...(request.id === undefined ? {} : { id: request.id }),
		}
	}
	return {
		jsonrpc: '2.0',
		result: {
			data: /** @type any */ (data),
			...result,
		},
		method: 'tevm_contract',
		...(request.id === undefined ? {} : { id: request.id }),
	}
}
