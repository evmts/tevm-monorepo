import { hexToBigInt } from '@tevm/utils'
import { ethSignTransactionHandler } from './ethSignTransactionHandler.js'

/**
 * @param {Parameters<typeof ethSignTransactionHandler>[0]} options
 * @returns {import('./EthProcedure.js').EthSignTransactionJsonRpcProcedure}
 */
export const ethSignTransactionProcedure = (options) => async (req) => ({
	...(req.id ? { id: req.id } : {}),
	jsonrpc: '2.0',
	method: req.method,
	result: await ethSignTransactionHandler(options)({
		from: req.params[0].from,
		...(req.params[0].to ? { to: req.params[0].to } : {}),
		...(req.params[0].data ? { data: req.params[0].data } : {}),
		...(req.params[0].value ? { value: hexToBigInt(req.params[0].value) } : {}),
		...(req.params[0].gas ? { gas: hexToBigInt(req.params[0].gas) } : {}),
		...(req.params[0].gasPrice ? { gasPrice: hexToBigInt(req.params[0].gasPrice) } : {}),
		...(req.params[0].maxFeePerGas ? { maxFeePerGas: hexToBigInt(req.params[0].maxFeePerGas) } : {}),
		...(req.params[0].maxPriorityFeePerGas
			? { maxPriorityFeePerGas: hexToBigInt(req.params[0].maxPriorityFeePerGas) }
			: {}),
		...(req.params[0].maxFeePerBlobGas ? { maxFeePerBlobGas: hexToBigInt(req.params[0].maxFeePerBlobGas) } : {}),
		...(req.params[0].nonce ? { nonce: hexToBigInt(req.params[0].nonce) } : {}),
		...(req.params[0].accessList ? { accessList: req.params[0].accessList } : {}),
		...(req.params[0].authorizationList ? { authorizationList: req.params[0].authorizationList } : {}),
		...(req.params[0].blobVersionedHashes ? { blobVersionedHashes: req.params[0].blobVersionedHashes } : {}),
	}),
})
