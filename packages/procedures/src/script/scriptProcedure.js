import { scriptHandler } from '@tevm/actions'
import { hexToBigInt, numberToHex } from '@tevm/utils'
import { parseBlockTag } from '../utils/parseBlockTag.js'

/**
 * @deprecated Use CallJsonRpcProcedure instead
 * Creates a Script JSON-RPC Procedure for handling script requests with Ethereumjs VM
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./ScriptJsonRpcProcedure.js').ScriptJsonRpcProcedure}
 */
export const scriptProcedure = (client) => async (request) => {
	/**
	 * @type {import('@tevm/actions').ScriptResult}
	 */
	let res
	try {
		res = await scriptHandler(client)({
			throwOnFail: false,
			deployedBytecode: request.params[0].deployedBytecode,
			// internally we pass data directly in which works but typescript interface doesn't support publically
			abi: /** @type any*/ (undefined),
			functionName: /** @type any*/ (undefined),
			args: /** @type any*/ (undefined),
			...{ data: request.params[0].data },
			...(request.params[0].deployedBytecode ? { deployedBytecode: request.params[0].deployedBytecode } : {}),
			...(request.params[0].blobVersionedHashes ? { blobVersionedHashes: request.params[0].blobVersionedHashes } : {}),
			...(request.params[0].caller ? { caller: request.params[0].caller } : {}),
			...(request.params[0].data ? { data: request.params[0].data } : {}),
			...(request.params[0].depth ? { depth: request.params[0].depth } : {}),
			...(request.params[0].gasPrice ? { gasPrice: hexToBigInt(request.params[0].gasPrice) } : {}),
			...(request.params[0].gasPrice ? { gasPrice: hexToBigInt(request.params[0].gasPrice) } : {}),
			...(request.params[0].gas ? { gas: hexToBigInt(request.params[0].gas) } : {}),
			...(request.params[0].gas ? { gas: hexToBigInt(request.params[0].gas) } : {}),
			...(request.params[0].gasRefund ? { gasRefund: hexToBigInt(request.params[0].gasRefund) } : {}),
			...(request.params[0].origin ? { origin: request.params[0].origin } : {}),
			...(request.params[0].selfdestruct ? { selfdestruct: new Set(request.params[0].selfdestruct) } : {}),
			...(request.params[0].skipBalance ? { skipBalance: request.params[0].skipBalance } : {}),
			...(request.params[0].to ? { to: request.params[0].to } : {}),
			...(request.params[0].value ? { value: hexToBigInt(request.params[0].value) } : {}),
			...(request.params[0].blockTag ? { blockTag: parseBlockTag(request.params[0].blockTag) } : {}),
			...(request.params[0].createTransaction !== undefined
				? { createTransaction: request.params[0].createTransaction }
				: {}),
		})
	} catch (e) {
		const tevmError = /** @type {import('@tevm/actions').TevmScriptError} */ (e)
		return {
			jsonrpc: '2.0',
			method: 'tevm_script',
			error: {
				code: tevmError.code ?? -32000,
				message: tevmError._tag ?? 'An unexpected unhandled error occurred',
			},
			...(request.id === undefined ? {} : { id: request.id }),
		}
	}
	// We only return the raw data
	const { errors = [], ...result } = res
	if (errors.length > 0) {
		const error = /** @type {import('@tevm/actions').TevmScriptError}*/ (errors[0])
		return {
			jsonrpc: '2.0',
			error: {
				code: error.code ?? -32000,
				message: error.message ?? 'An unexpected unhandled error occurred',
				data: {
					errors: errors.map(({ message }) => message),
				},
			},
			method: 'tevm_script',
			...(request.id === undefined ? {} : { id: request.id }),
		}
	}

	/**
	 * @type {Record<`0x${string}`, Array<import('@tevm/utils').Hex>> | undefined}
	 */
	const accessList =
		result.accessList !== undefined
			? Object.fromEntries(Object.entries(result.accessList).map(([key, value]) => [key, [...value]]))
			: undefined
	/**
	 * @param {bigint} value
	 */
	const toHex = (value) => /**@type {import('@tevm/utils').Hex}*/ (numberToHex(value))
	return {
		jsonrpc: '2.0',
		result: {
			executionGasUsed: toHex(result.executionGasUsed),
			rawData: result.rawData,
			...(result.selfdestruct ? { selfdestruct: [...result.selfdestruct] } : {}),
			...(result.gasRefund ? { gasRefund: toHex(result.gasRefund) } : {}),
			...(result.gas ? { gas: toHex(result.gas) } : {}),
			...(result.logs ? { logs: result.logs } : {}),
			...(result.blobGasUsed ? { blobGasUsed: toHex(result.blobGasUsed) } : {}),
			...(result.txHash ? { txHash: result.txHash } : {}),
			...(result.blobGasUsed ? { blobGasUsed: toHex(result.blobGasUsed) } : {}),
			...(accessList !== undefined ? { accessList } : {}),
			...(result.preimages ? { preimages: result.preimages } : {}),
			...(result.l1Fee ? { l1DataFee: numberToHex(result.l1Fee) } : {}),
			...(result.l1BaseFee ? { l1BaseFee: numberToHex(result.l1BaseFee) } : {}),
			...(result.l1BlobFee ? { l1BlobFee: numberToHex(result.l1BlobFee) } : {}),
			...(result.l1GasUsed ? { l1GasUsed: numberToHex(result.l1GasUsed) } : {}),
			...(result.amountSpent ? { amountSpent: numberToHex(result.amountSpent) } : {}),
			...(result.baseFee ? { baseFee: numberToHex(result.baseFee) } : {}),
			...(result.totalGasSpent ? { totalGasSpent: numberToHex(result.totalGasSpent) } : {}),
			...(result.trace
				? {
						trace: {
							...result.trace,
							gas: toHex(result.trace.gas),
							structLogs: result.trace.structLogs.map((log) => ({
								...log,
								gas: toHex(log.gas),
								gasCost: toHex(log.gasCost),
								stack: [...log.stack],
							})),
						},
					}
				: {}),
			...(result.createdAddress ? { createdAddress: result.createdAddress } : {}),
			...(result.createdAddresses ? { createdAddresses: [...result.createdAddresses] } : {}),
		},
		method: 'tevm_script',
		...(request.id === undefined ? {} : { id: request.id }),
	}
}
