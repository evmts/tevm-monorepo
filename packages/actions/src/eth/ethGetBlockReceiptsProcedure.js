import { hexToBigInt, numberToHex } from '@tevm/utils'
import { ethGetBlockReceiptsHandler } from './ethGetBlockReceiptsHandler.js'

/**
 * Procedure for handling eth_getBlockReceipts JSON-RPC requests.
 * Accepts either a block hash, hex block number, or block tag.
 *
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./EthProcedure.js').EthGetBlockReceiptsJsonRpcProcedure}
 */
export const ethGetBlockReceiptsJsonRpcProcedure = (client) => async (req) => {
	const [blockId] = req.params

	if (!blockId) {
		/**
		 * @type {import('./EthJsonRpcResponse.js').EthGetBlockReceiptsJsonRpcResponse}
		 */
		const out = {
			jsonrpc: '2.0',
			...(req.id !== undefined ? { id: req.id } : {}),
			method: req.method,
			error: {
				code: -32602,
				message: 'Invalid params: blockId is required',
			},
		}
		return out
	}

	// Parse block identifier
	let params
	if (blockId.startsWith('0x')) {
		// Could be a block hash (66 chars) or block number (variable length)
		if (blockId.length === 66) {
			// Block hash
			params = { blockHash: /** @type {import('@tevm/utils').Hex} */ (blockId) }
		} else {
			// Block number as hex
			params = { blockTag: hexToBigInt(/** @type {import('@tevm/utils').Hex} */ (blockId)) }
		}
	} else {
		// Block tag (e.g., 'latest', 'earliest', 'pending')
		params = { blockTag: /** @type {import('@tevm/utils').BlockTag} */ (blockId) }
	}

	const handler = ethGetBlockReceiptsHandler(client)
	const res = await handler(params)

	const out = /** @type {import('./EthJsonRpcResponse.js').EthGetBlockReceiptsJsonRpcResponse} */ ({
		jsonrpc: '2.0',
		...(req.id !== undefined ? { id: req.id } : {}),
		method: req.method,
		result: res?.map((receipt) => ({
			blockHash: receipt.blockHash,
			blockNumber: numberToHex(receipt.blockNumber),
			cumulativeGasUsed: numberToHex(receipt.cumulativeGasUsed),
			effectiveGasPrice: numberToHex(receipt.effectiveGasPrice),
			from: receipt.from,
			to: receipt.to,
			root: receipt.root ?? '0x',
			gasUsed: numberToHex(receipt.gasUsed),
			transactionHash: receipt.transactionHash,
			transactionIndex: numberToHex(receipt.transactionIndex),
			contractAddress: receipt.contractAddress,
			logs: receipt.logs.map((log) => ({
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
			logsBloom: receipt.logsBloom,
			status: receipt.status ?? '0x0',
			...(receipt.blobGasUsed !== undefined ? { blobGasUsed: numberToHex(receipt.blobGasUsed) } : {}),
			...(receipt.blobGasPrice !== undefined ? { blobGasPrice: numberToHex(receipt.blobGasPrice) } : {}),
		})),
	})
	return out
}
