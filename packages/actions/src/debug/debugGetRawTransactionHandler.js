import { bytesToHex, hexToBytes } from '@tevm/utils'

/**
 * Returns the raw transaction bytes by transaction hash
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./DebugHandler.js').DebugGetRawTransactionHandler}
 * @example
 * ```javascript
 * import { createMemoryClient } from '@tevm/memory-client'
 * import { debugGetRawTransactionHandler } from '@tevm/actions'
 *
 * const client = createMemoryClient()
 * const handler = debugGetRawTransactionHandler(client)
 *
 * const rawTx = await handler({ hash: '0x1234...' })
 * console.log(rawTx) // '0x...' (hex-encoded transaction)
 * ```
 */
export const debugGetRawTransactionHandler =
	(client) =>
	/**
	 * @param {import('./DebugParams.js').DebugGetRawTransactionParams} params
	 * @returns {Promise<import('./DebugResult.js').DebugGetRawTransactionResult>}
	 */
	async (params) => {
		const { logger, getVm, getReceiptsManager } = client
		logger.debug(params, 'debugGetRawTransactionHandler: executing debug_getRawTransaction with params')

		// Get the receipt to find which block contains the transaction
		const receiptsManager = await getReceiptsManager()
		const receipt = await receiptsManager.getReceiptByTxHash(hexToBytes(params.hash))

		if (!receipt) {
			const msg = `Transaction not found: ${params.hash}`
			logger.warn(msg)
			throw new Error(msg)
		}

		const [_receiptData, blockHash, txIndex] = receipt

		logger.debug({ blockHash: bytesToHex(blockHash), txIndex }, 'debugGetRawTransactionHandler: found transaction')

		// Get the block containing the transaction
		const vm = await getVm()
		const block = await vm.blockchain.getBlock(blockHash)

		const tx = block.transactions[txIndex]

		if (!tx) {
			const msg = `Transaction not found at index ${txIndex} in block ${bytesToHex(blockHash)}`
			logger.error(msg)
			throw new Error(msg)
		}

		logger.debug({ txIndex, txType: tx.type }, 'debugGetRawTransactionHandler: serializing transaction')

		// Serialize the transaction
		const serialized = tx.serialize()

		// Convert to hex
		const result = bytesToHex(serialized)

		logger.debug({ result }, 'debugGetRawTransactionHandler: successfully serialized transaction')

		return result
	}
