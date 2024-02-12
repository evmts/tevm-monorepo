import { bigIntToHex } from '@ethereumjs/util'
import { scriptHandler } from '@tevm/actions'
import { hexToBigInt } from 'viem'

/**
 * Creates a Script JSON-RPC Procedure for handling script requests with Ethereumjs VM
 * @param {import('@tevm/vm').TevmVm} vm
 * @returns {import('@tevm/procedures-types').ScriptJsonRpcProcedure}
 */
export const scriptProcedure = (vm) => async (request) => {
	/**
	 * @type {import('@tevm/actions-types').ScriptResult}
	 */
	let res
	try {
		res = await scriptHandler(vm)({
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
			...(request.params.gasPrice
				? { gasPrice: hexToBigInt(request.params.gasPrice) }
				: {}),
			...(request.params.gasPrice
				? { gasPrice: hexToBigInt(request.params.gasPrice) }
				: {}),
			...(request.params.gas ? { gas: hexToBigInt(request.params.gas) } : {}),
			...(request.params.gas ? { gas: hexToBigInt(request.params.gas) } : {}),
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
			...(request.params.blockTag ? { blockTag: request.params.blockTag } : {}),
			...(request.params.createTransaction !== undefined
				? { createTransaction: request.params.createTransaction }
				: {}),
		})
	} catch (e) {
		const tevmError = /** @type {import('@tevm/errors').ScriptError} */ (e)
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
		const error = /** @type {import('@tevm/errors').ScriptError}*/ (errors[0])
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
