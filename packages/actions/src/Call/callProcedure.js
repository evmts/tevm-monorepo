import { hexToBigInt, numberToHex } from '@tevm/utils'
import { parseBlockTag } from '../utils/parseBlockTag.js'
import { callHandler } from './callHandler.js'

/**
 * Creates a Call JSON-RPC Procedure for handling call requests with Ethereumjs EVM
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./CallJsonRpcProcedure.js').CallJsonRpcProcedure}
 */
export const callProcedure = (client) => async (request) => {
	const { errors = [], ...result } = await callHandler(client)({
		throwOnFail: false,
		...(request.params[1]
			? {
					stateOverrideSet: Object.fromEntries(
						Object.entries(request.params[1]).map(([address, state]) => [
							address,
							{
								...(state.code ? { code: state.code } : {}),
								...(state.balance ? { balance: hexToBigInt(state.balance) } : {}),
								...(state.nonce ? { nonce: hexToBigInt(state.nonce) } : {}),
								...(state.state ? { state: state.state } : {}),
								...(state.stateDiff ? { stateDiff: state.stateDiff } : {}),
							},
						]),
					),
				}
			: {}),
		...(request.params[2]
			? {
					blockOverrideSet: {
						...(request.params[2].blobBaseFee ? { blobBaseFee: hexToBigInt(request.params[2].blobBaseFee) } : {}),
						...(request.params[2].baseFee ? { baseFee: hexToBigInt(request.params[2].baseFee) } : {}),
						...(request.params[2].gasLimit ? { gasLimit: hexToBigInt(request.params[2].gasLimit) } : {}),
						...(request.params[2].coinbase ? { coinbase: request.params[2].coinbase } : {}),
						...(request.params[2].time ? { time: hexToBigInt(request.params[2].time) } : {}),
						...(request.params[2].number ? { number: hexToBigInt(request.params[2].number) } : {}),
					},
				}
			: {}),
		...(request.params[0].code ? { code: request.params[0].code } : {}),
		...(request.params[0].data ? { data: request.params[0].data } : {}),
		...(request.params[0].deployedBytecode ? { deployedBytecode: request.params[0].deployedBytecode } : {}),
		...(request.params[0].createTrace ? { createTrace: request.params[0].createTrace } : {}),
		...(request.params[0].createAccessList ? { createAccessList: request.params[0].createAccessList } : {}),
		...(request.params[0].blobVersionedHashes ? { blobVersionedHashes: request.params[0].blobVersionedHashes } : {}),
		...(request.params[0].caller ? { caller: request.params[0].caller } : {}),
		...(request.params[0].depth ? { depth: request.params[0].depth } : {}),
		...(request.params[0].gasPrice ? { gasPrice: hexToBigInt(request.params[0].gasPrice) } : {}),
		...(request.params[0].gas ? { gas: hexToBigInt(request.params[0].gas) } : {}),
		...(request.params[0].gasRefund ? { gasRefund: hexToBigInt(request.params[0].gasRefund) } : {}),
		...(request.params[0].origin ? { origin: request.params[0].origin } : {}),
		...(request.params[0].salt ? { salt: request.params[0].salt } : {}),
		...(request.params[0].selfdestruct ? { selfdestruct: new Set(request.params[0].selfdestruct) } : {}),
		...(request.params[0].skipBalance ? { skipBalance: request.params[0].skipBalance } : {}),
		...(request.params[0].to ? { to: request.params[0].to } : {}),
		...(request.params[0].value ? { value: hexToBigInt(request.params[0].value) } : {}),
		...(request.params[0].blockTag ? { blockTag: parseBlockTag(request.params[0].blockTag) } : {}),
		...(request.params[0].createTransaction ? { createTransaction: request.params[0].createTransaction } : {}),
		...(request.params[0].from ? { from: request.params[0].from } : {}),
		...(request.params[0].maxFeePerGas ? { maxFeePerGas: hexToBigInt(request.params[0].maxFeePerGas) } : {}),
		...(request.params[0].maxPriorityFeePerGas
			? { maxPriorityFeePerGas: hexToBigInt(request.params[0].maxPriorityFeePerGas) }
			: {}),
	})
	if (errors.length > 0) {
		const error = /** @type {import('./TevmCallError.js').TevmCallError}*/ (errors[0])
		return {
			jsonrpc: '2.0',
			error: {
				code: error.code,
				message: error.message,
				data: {
					data: result.rawData,
					errors: errors.map(({ message }) => message),
				},
			},
			method: 'tevm_call',
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
	 * @returns {import('@tevm/utils').Hex}
	 */
	const toHex = (value) => /**@type {import('@tevm/utils').Hex}*/ (numberToHex(value))
	/**
	 * @type {import('./CallJsonRpcResponse.js').CallJsonRpcResponse}
	 */
	const out = {
		jsonrpc: '2.0',
		result: {
			executionGasUsed: toHex(result.executionGasUsed),
			rawData: result.rawData,
			...(result.selfdestruct ? { selfdestruct: [...result.selfdestruct] } : {}),
			...(result.gasRefund ? { gasRefund: toHex(result.gasRefund) } : {}),
			...(result.gas ? { gas: toHex(result.gas) } : {}),
			...(result.logs ? { logs: result.logs } : {}),
			...(result.txHash ? { txHash: result.txHash } : {}),
			...(result.blobGasUsed ? { blobGasUsed: toHex(result.blobGasUsed) } : {}),
			...(accessList !== undefined ? { accessList } : {}),
			...(result.preimages ? { preimages: result.preimages } : {}),
			...(result.l1Fee ? { l1Fee: numberToHex(result.l1Fee) } : {}),
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
		method: 'tevm_call',
		...(request.id === undefined ? {} : { id: request.id }),
	}

	return out
}
