import { getAccountHandler } from '@tevm/actions'
import { numberToHex } from '@tevm/utils'

/**
 * Creates an GetAccount JSON-RPC Procedure for handling account requests with Ethereumjs VM
 * @param {import('@tevm/base-client').BaseClient} client
 * @returns {import('./GetAccountJsonRpcProcedure.js').GetAccountJsonRpcProcedure}
 */
export const getAccountProcedure = (client) => async (request) => {
	request.params
	const { errors = [], ...result } = await getAccountHandler(client)({
		address: request.params[0].address,
		throwOnFail: false,
		returnStorage: request.params[0].returnStorage ?? false,
	})
	if (errors.length > 0) {
		const error = /** @type {import('@tevm/actions').TevmGetAccountError}*/ (errors[0])
		return {
			jsonrpc: '2.0',
			error: {
				code: error.code,
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
			isContract: result.isContract,
			isEmpty: result.isEmpty,
			codeHash: result.codeHash,
			storage: result.storage,
		}),
		method: 'tevm_getAccount',
		...(request.id === undefined ? {} : { id: request.id }),
	}
}
