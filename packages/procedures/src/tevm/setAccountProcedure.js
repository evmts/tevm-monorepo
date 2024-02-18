import { setAccountHandler } from '@tevm/actions'
import { hexToBigInt } from '@tevm/utils'

/**
 * Creates an SetAccount JSON-RPC Procedure for handling tevm_setAccount requests with Ethereumjs VM
 * @param {import('@tevm/base-client').BaseClient} client
 * @returns {import('@tevm/procedures-types').SetAccountJsonRpcProcedure}
 */
export const setAccountProcedure = (client) => async (request) => {
	request.params
	const { errors = [], ...result } = await setAccountHandler(client)({
		throwOnFail: false,
		address: request.params[0].address,
		...(request.params[0].nonce
			? { nonce: hexToBigInt(request.params[0].nonce) }
			: {}),
		...(request.params[0].balance
			? { balance: hexToBigInt(request.params[0].balance) }
			: {}),
		...(request.params[0].deployedBytecode
			? { deployedBytecode: request.params[0].deployedBytecode }
			: {}),
		...(request.params[0].storageRoot
			? { storageRoot: request.params[0].storageRoot }
			: {}),
	})
	if (errors.length > 0) {
		const error = /** @type {import('@tevm/errors').SetAccountError}*/ (
			errors[0]
		)
		return {
			jsonrpc: '2.0',
			error: {
				code: error._tag,
				message: error.message,
				data: {
					errors: errors.map(({ message }) => message),
				},
			},
			method: 'tevm_setAccount',
			...(request.id === undefined ? {} : { id: request.id }),
		}
	}
	return {
		jsonrpc: '2.0',
		result,
		method: 'tevm_setAccount',
		...(request.id === undefined ? {} : { id: request.id }),
	}
}
