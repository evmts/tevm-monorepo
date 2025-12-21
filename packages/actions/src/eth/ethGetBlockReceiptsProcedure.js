import { hexToBigInt, numberToHex } from '@tevm/utils'
import { ethGetBlockReceiptsHandler } from './ethGetBlockReceiptsHandler.js'

/**
 * Procedure for handling eth_getBlockReceipts JSON-RPC requests.
 *
 * This procedure validates the request parameters and calls the handler to retrieve
 * all transaction receipts for the specified block.
 *
 * @param {import('@tevm/node').TevmNode} client - The Tevm client instance
 * @returns {import('./EthProcedure.js').EthGetBlockReceiptsJsonRpcProcedure} The JSON-RPC procedure
 *
 * @example
 * ```javascript
 * import { createTevmNode } from '@tevm/node'
 * import { ethGetBlockReceiptsProcedure } from '@tevm/actions'
 *
 * const client = await createTevmNode()
 * const procedure = ethGetBlockReceiptsProcedure(client)
 *
 * const response = await procedure({
 *   jsonrpc: '2.0',
 *   method: 'eth_getBlockReceipts',
 *   params: ['0x1234'],
 *   id: 1
 * })
 * ```
 */
export const ethGetBlockReceiptsJsonRpcProcedure = (client) => async (req) => {
	const [blockId] = req.params

	if (!blockId) {
		/**
		 * @type {import('./EthJsonRpcResponse.js').EthGetBlockReceiptsJsonRpcResponse}
		 */
		const out = {
			jsonrpc: '2.0',
			...(req.id ? { id: req.id } : {}),
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

	/**
	 * @type {import('./EthJsonRpcResponse.js').EthGetBlockReceiptsJsonRpcResponse}
	 */
	const out = {
		jsonrpc: '2.0',
		...(req.id ? { id: req.id } : {}),
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
	}
	return out
}
