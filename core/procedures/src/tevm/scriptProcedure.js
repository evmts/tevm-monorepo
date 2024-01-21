import { scriptHandler } from '../index.js'
import { bigIntToHex } from '@ethereumjs/util'
import { hexToBigInt } from 'viem'

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
		res = await scriptHandler(evm)({
			deployedBytecode: request.params.deployedBytecode,
			// internally we pass data directly in which works but typescript interface doesn't support publically
			abi: /** @type any*/ (undefined),
			functionName: /** @type any*/ (undefined),
			args: /** @type any*/ (undefined),
			...{ data: request.params.data },
			...(request.params.deployedBytecode
				? { deployedBytecode: request.params.deployedBytecode }
				: {}),
			...(request.params.blobVersionedHashes
				? { blobVersionedHashes: request.params.blobVersionedHashes }
				: {}),
			...(request.params.caller ? { caller: request.params.caller } : {}),
			...(request.params.data ? { data: request.params.data } : {}),
			...(request.params.depth ? { depth: request.params.depth } : {}),
			...(request.params.gasLimit
				? { gasLimit: hexToBigInt(request.params.gasLimit) }
				: {}),
			...(request.params.gasPrice
				? { gasPrice: hexToBigInt(request.params.gasPrice) }
				: {}),
			...(request.params.gasRefund
				? { gasRefund: hexToBigInt(request.params.gasRefund) }
				: {}),
			...(request.params.origin ? { origin: request.params.origin } : {}),
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
							? {
									baseFeePerGas: hexToBigInt(
										request.params.block.baseFeePerGas,
									),
							  }
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
	// We only return the raw data
	const { errors = [], ...result } = res
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
	/**
	 * @param {bigint} value
	 */
	const toHex = (value) => /**@type {import('viem').Hex}*/ (bigIntToHex(value))
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
		method: 'tevm_script',
		...(request.id === undefined ? {} : { id: request.id }),
	}
}
