import { setAccountHandler } from '@tevm/actions'
import { hexToBigInt } from 'viem'

/**
 * Creates an SetAccount JSON-RPC Procedure for handling tevm_setAccount requests with Ethereumjs EVM
 * @param {import('@ethereumjs/evm').EVM} evm
 * @returns {import('@tevm/procedures-spec').SetAccountJsonRpcProcedure}
 */
export const setAccountProcedure = (evm) => async (request) => {
	request.params
	const { errors = [], ...result } = await setAccountHandler(evm)({
		address: request.params.address,
		...(request.params.nonce
			? { nonce: hexToBigInt(request.params.nonce) }
			: {}),
		...(request.params.balance
			? { balance: hexToBigInt(request.params.balance) }
			: {}),
		...(request.params.deployedBytecode
			? { deployedBytecode: request.params.deployedBytecode }
			: {}),
		...(request.params.storageRoot
			? { storageRoot: request.params.storageRoot }
			: {}),
	})
	if (errors.length > 0) {
		const error = /** @type {import('@tevm/errors').SetAccountError}*/ (errors[0])
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
