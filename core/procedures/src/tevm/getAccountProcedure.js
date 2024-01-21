import { getAccountHandler } from '@tevm/actions'
import { numberToHex } from 'viem'

/**
 * Creates an GetAccount JSON-RPC Procedure for handling account requests with Ethereumjs EVM
 * @param {import('@ethereumjs/evm').EVM} evm
 * @returns {import('@tevm/procedures-spec').GetAccountJsonRpcProcedure}
 */
export const getAccountProcedure = (evm) => async (request) => {
	request.params
	const { errors = [], ...result } = await getAccountHandler(evm)({
		address: request.params.address,
	})
	if (errors.length > 0) {
		const error = /** @type {import('@tevm/errors').GetAccountError}*/ (errors[0])
		return {
			jsonrpc: '2.0',
			error: {
				code: error._tag,
				message: error.message,
				data: {
					errors: errors.map(({ message }) => message),
				},
			},
			method: 'tevm_getAccount',
			...(request.id === undefined ? {} : { id: request.id }),
		}
	}
	return {
		jsonrpc: '2.0',
		result: /** @type any*/ ({
			address: result.address,
			balance: numberToHex(result.balance ?? 0n),
			deployedBytecode: result.deployedBytecode ?? '0x0',
			nonce: numberToHex(result.nonce ?? 0n),
			storageRoot: result.storageRoot,
		}),
		method: 'tevm_getAccount',
		...(request.id === undefined ? {} : { id: request.id }),
	}
}
