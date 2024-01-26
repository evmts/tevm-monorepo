import { bigIntToHex } from '@ethereumjs/util'
import { callHandler } from '@tevm/actions'
import { hexToBigInt } from 'viem'

/**
 * Creates a Call JSON-RPC Procedure for handling call requests with Ethereumjs EVM
 * @param {import('@ethereumjs/evm').EVM} evm
 * @returns {import('@tevm/procedures-types').CallJsonRpcProcedure}
 */
export const callProcedure = (evm) => async (request) => {
	const { errors = [], ...result } = await callHandler(evm)({
		...(request.params.deployedBytecode
			? { deployedBytecode: request.params.deployedBytecode }
			: {}),
		...(request.params.blobVersionedHashes
			? { blobVersionedHashes: request.params.blobVersionedHashes }
			: {}),
		...(request.params.caller ? { caller: request.params.caller } : {}),
		...(request.params.data ? { data: request.params.data } : {}),
		...(request.params.depth ? { depth: request.params.depth } : {}),
		...(request.params.gas
			? { gas: hexToBigInt(request.params.gas) }
			: {}),
		...(request.params.gasPrice
			? { gasPrice: hexToBigInt(request.params.gasPrice) }
			: {}),
		...(request.params.gasRefund
			? { gasRefund: hexToBigInt(request.params.gasRefund) }
			: {}),
		...(request.params.origin ? { origin: request.params.origin } : {}),
		...(request.params.salt ? { salt: request.params.salt } : {}),
		...(request.params.selfdestruct
			? { selfdestruct: new Set(request.params.selfdestruct) }
			: {}),
		...(request.params.skipBalance
			? { skipBalance: request.params.skipBalance }
			: {}),
		...(request.params.to ? { to: request.params.to } : {}),
		...(request.params.value
			? { value: hexToBigInt(request.params.value) }
			: {}),
		...(request.params.block
			? {
				...(request.params.block.gasLimit
					? { gasLimit: hexToBigInt(request.params.block.gasLimit) }
					: {}),
				...(request.params.block.baseFeePerGas
					? { baseFeePerGas: hexToBigInt(request.params.block.baseFeePerGas) }
					: {}),
				...(request.params.block.blobGasPrice
					? { blobGasPrice: hexToBigInt(request.params.block.blobGasPrice) }
					: {}),
				...(request.params.block.difficulty
					? { difficulty: hexToBigInt(request.params.block.difficulty) }
					: {}),
				...(request.params.block.number
					? { number: hexToBigInt(request.params.block.number) }
					: {}),
				...(request.params.block.timestamp
					? { timestamp: hexToBigInt(request.params.block.timestamp) }
					: {}),
			}
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
	 * @returns {import('viem').Hex}
	 */
	const toHex = (value) => /**@type {import('viem').Hex}*/(bigIntToHex(value))
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
