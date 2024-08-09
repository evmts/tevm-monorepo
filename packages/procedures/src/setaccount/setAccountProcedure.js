import { setAccountHandler } from '@tevm/actions'
import { hexToBigInt } from '@tevm/utils'

/**
 * Creates an SetAccount JSON-RPC Procedure for handling tevm_setAccount requests with Ethereumjs VM
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./SetAccountJsonRpcProcedure.js').SetAccountJsonRpcProcedure}
 */
export const setAccountProcedure = (client) => async (request) => {
	const { errors = [], ...result } = await setAccountHandler(client)({
		throwOnFail: false,
		address: request.params[0].address,
		...(request.params[0].nonce ? { nonce: hexToBigInt(request.params[0].nonce) } : {}),
		...(request.params[0].balance ? { balance: hexToBigInt(request.params[0].balance) } : {}),
		...(request.params[0].deployedBytecode ? { deployedBytecode: request.params[0].deployedBytecode } : {}),
		...(request.params[0].storageRoot ? { storageRoot: request.params[0].storageRoot } : {}),
		...(request.params[0].state ? { state: request.params[0].state } : {}),
		...(request.params[0].stateDiff ? { stateDiff: request.params[0].stateDiff } : {}),
	})
	if (errors.length > 0) {
		const error = /** @type {import('@tevm/actions').TevmSetAccountError}*/ (errors[0])
		return {
			jsonrpc: '2.0',
			error: {
				code: error.code,
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
