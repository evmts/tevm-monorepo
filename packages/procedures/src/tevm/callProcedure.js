import { callHandler } from '@tevm/actions'
import { hexToBigInt, numberToHex } from '@tevm/utils'

/**
 * Creates a Call JSON-RPC Procedure for handling call requests with Ethereumjs EVM
 * @param {import('@tevm/base-client').BaseClient} client
 * @returns {import('@tevm/procedures-types').CallJsonRpcProcedure}
 */
export const callProcedure = (client) => async (request) => {
	const { errors = [], ...result } = await callHandler(client)({
		throwOnFail: false,
		...(request.params[0].deployedBytecode
			? { deployedBytecode: request.params[0].deployedBytecode }
			: {}),
		...(request.params[0].blobVersionedHashes
			? { blobVersionedHashes: request.params[0].blobVersionedHashes }
			: {}),
		...(request.params[0].caller ? { caller: request.params[0].caller } : {}),
		...(request.params[0].data ? { data: request.params[0].data } : {}),
		...(request.params[0].depth ? { depth: request.params[0].depth } : {}),
		...(request.params[0].gasPrice
			? { gasPrice: hexToBigInt(request.params[0].gasPrice) }
			: {}),
		...(request.params[0].gas
			? { gas: hexToBigInt(request.params[0].gas) }
			: {}),
		...(request.params[0].gasRefund
			? { gasRefund: hexToBigInt(request.params[0].gasRefund) }
			: {}),
		...(request.params[0].origin ? { origin: request.params[0].origin } : {}),
		...(request.params[0].salt ? { salt: request.params[0].salt } : {}),
		...(request.params[0].selfdestruct
			? { selfdestruct: new Set(request.params[0].selfdestruct) }
			: {}),
		...(request.params[0].skipBalance
			? { skipBalance: request.params[0].skipBalance }
			: {}),
		...(request.params[0].to ? { to: request.params[0].to } : {}),
		...(request.params[0].value
			? { value: hexToBigInt(request.params[0].value) }
			: {}),
		...(request.params[0].blockTag
			? { blockTag: request.params[0].blockTag }
			: {}),
		...(request.params[0].createTransaction
			? { createTransaction: request.params[0].createTransaction }
			: {}),
	})
	if (errors.length > 0) {
		const error = /** @type {import('@tevm/errors').CallError}*/ (errors[0])
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
	/**
	 * @param {bigint} value
	 * @returns {import('@tevm/utils').Hex}
	 */
	const toHex = (value) =>
		/**@type {import('@tevm/utils').Hex}*/ (numberToHex(value))
	return {
		jsonrpc: '2.0',
		result: {
			executionGasUsed: toHex(result.executionGasUsed),
			rawData: result.rawData,
			...(result.selfdestruct
				? { selfdestruct: [...result.selfdestruct] }
				: {}),
			...(result.gasRefund ? { gasRefund: toHex(result.gasRefund) } : {}),
			...(result.gas ? { gas: toHex(result.gas) } : {}),
			...(result.logs ? { logs: result.logs } : {}),
			...(result.blobGasUsed ? { blobGasUsed: toHex(result.blobGasUsed) } : {}),
			...(result.createdAddress
				? { createdAddress: result.createdAddress }
				: {}),
			...(result.createdAddresses
				? { createdAddresses: [...result.createdAddresses] }
				: {}),
		},
		method: 'tevm_call',
		...(request.id === undefined ? {} : { id: request.id }),
	}
}
