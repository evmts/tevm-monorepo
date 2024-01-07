import { hexToBigInt } from 'viem'
import { accountHandler } from '../index.js'

/**
 * Creates an Account JSON-RPC Procedure for handling account requests with Ethereumjs EVM
 * @param {import('@ethereumjs/evm').EVM} evm
 * @returns {import('@tevm/api').AccountJsonRpcProcedure}
 */
export const accountProcedure = (evm) => async (request) => {
	request.params
	const { errors = [], ...result } = await accountHandler(evm)({
		address: request.params.address,
		...(request.params.nonce ? { nonce: hexToBigInt(request.params.nonce) } : {}),
		...(request.params.balance ? { balance: hexToBigInt(request.params.balance) } : {}),
		...(request.params.deployedBytecode ? { deployedBytecode: request.params.deployedBytecode } : {}),
		...(request.params.storageRoot ? { storageRoot: request.params.storageRoot } : {}),
	})
	if (errors.length > 0) {
		const error = /** @type {import('@tevm/api').AccountError}*/ (errors[0])
		return {
			jsonrpc: '2.0',
			error: {
				code: error._tag,
				message: error.message,
				data: {
					errors: errors.map(({ message }) => message),
				},
			},
			method: 'tevm_account',
			...(request.id === undefined ? {} : { id: request.id }),
		}
	}
	return {
		jsonrpc: '2.0',
		result,
		method: 'tevm_account',
		...(request.id === undefined ? {} : { id: request.id }),
	}
}
