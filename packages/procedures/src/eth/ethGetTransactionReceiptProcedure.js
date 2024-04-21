import { ethGetTransactionReceiptHandler } from '@tevm/actions'
import { numberToHex } from '@tevm/utils'

/**
 * @param {Pick<import('@tevm/base-client').BaseClient, 'forkUrl'| 'getVm' | 'getChain' | 'getReceiptsManager' >} client
 * @returns {import('@tevm/procedures-types').EthGetTransactionReceiptJsonRpcProcedure}
 */
export const ethGetTransactionReceiptJsonRpcProcedure = (client) => async (req) => {
	const [txHash] = req.params

	if (!txHash) {
		/**
		 * @type {import('@tevm/procedures-types').EthGetTransactionReceiptJsonRpcResponse}
		 */
		const out = {
			jsonrpc: '2.0',
			...(req.id ? { id: req.id } : {}),
			method: req.method,
			error: {
				code: -32602,
				message: 'Invalid params',
			},
		}
		return out
	}

	const res = await ethGetTransactionReceiptHandler(client)({ hash: txHash })

	/**
	 * @type {import('@tevm/procedures-types').EthGetTransactionReceiptJsonRpcResponse}
	 */
	const out = {
		jsonrpc: '2.0',
		...(req.id ? { id: req.id } : {}),
		method: req.method,
		result: res && {
			blockHash: res.blockHash,
			blockNumber: numberToHex(res.blockNumber),
			cumulativeGasUsed: numberToHex(res.cumulativeGasUsed),
			from: res.from,
			to: res.to,
			gasUsed: numberToHex(res.gasUsed),
			transactionHash: res.transactionHash,
			transactionIndex: numberToHex(res.transactionIndex),
			contractAddress: res.contractAddress,
			logs: await Promise.all(
				res.logs.map((log) => ({
					address: log.address,
					blockHash: log.blockHash,
					blockNumber: numberToHex(log.blockNumber),
					data: log.data,
					logIndex: numberToHex(log.logIndex),
					removed: false,
					topics: [...log.topics],
					transactionIndex: numberToHex(log.transactionIndex),
					transactionHash: log.transactionHash,
				})),
			),
			logsBloom: res.logsBloom,
			status: res.status,
			// TODO fix the type
			blobGasUsed: res.blobGasUsed !== undefined ? numberToHex(res.blobGasUsed) : '0x',
			blobGasPrice: res.blobGasPrice !== undefined ? numberToHex(res.blobGasPrice) : '0x',
		},
	}
	return out
}
