import { Rlp } from '@tevm/rlp'
import { bytesToHex, hexToBigInt, hexToBytes, numberToHex } from '@tevm/utils'

/**
 * Returns the consensus-encoded (RLP) receipts from a block by block number or tag
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./DebugHandler.js').DebugGetRawReceiptsHandler}
 * @example
 * ```javascript
 * import { createMemoryClient } from '@tevm/memory-client'
 * import { debugGetRawReceiptsHandler } from '@tevm/actions'
 *
 * const client = createMemoryClient()
 * const handler = debugGetRawReceiptsHandler(client)
 *
 * const rawReceipts = await handler({ blockTag: 'latest' })
 * console.log(rawReceipts) // ['0x...', '0x...'] (array of hex-encoded RLP receipts)
 * ```
 */
export const debugGetRawReceiptsHandler =
	(client) =>
	/**
	 * @param {import('./DebugParams.js').DebugGetRawReceiptsParams} params
	 * @returns {Promise<import('./DebugResult.js').DebugGetRawReceiptsResult>}
	 */
	async (params) => {
		const { logger, getVm, getReceiptsManager } = client
		logger.debug(params, 'debugGetRawReceiptsHandler: executing debug_getRawReceipts with params')

		const vm = await getVm()

		// Get the block by number or tag
		const block = await (async () => {
			if (params.blockNumber !== undefined) {
				const blockNum =
					typeof params.blockNumber === 'bigint'
						? params.blockNumber
						: hexToBigInt(/** @type {import('@tevm/utils').Hex} */ (params.blockNumber))
				logger.debug({ blockNum }, 'debugGetRawReceiptsHandler: fetching block by number')
				return vm.blockchain.getBlock(blockNum)
			}
			if (params.blockTag !== undefined) {
				logger.debug({ blockTag: params.blockTag }, 'debugGetRawReceiptsHandler: fetching block by tag')
				return vm.blockchain.blocksByTag.get(params.blockTag)
			}
			// Default to latest
			logger.debug('debugGetRawReceiptsHandler: fetching latest block')
			return vm.blockchain.blocksByTag.get('latest')
		})()

		if (!block) {
			const msg = `Block not found: ${params.blockNumber ?? params.blockTag ?? 'latest'}`
			logger.warn(msg)
			throw new Error(msg)
		}

		logger.debug(
			{ blockNumber: block.header.number, txCount: block.transactions.length },
			'debugGetRawReceiptsHandler: fetching receipts for block',
		)

		// Get all receipts for the block
		const receiptsManager = await getReceiptsManager()
		const receipts = await receiptsManager.getReceipts(block.hash(), false, false)

		if (receipts.length === 0) {
			logger.debug('debugGetRawReceiptsHandler: no receipts found')
			return []
		}

		logger.debug({ receiptCount: receipts.length }, 'debugGetRawReceiptsHandler: encoding receipts to RLP')

		// Encode each receipt to RLP using consensus encoding format
		// This matches the format used in the receipts trie
		const encodedReceipts = receipts.map((receipt) => {
			// Consensus encoding: [status/stateRoot, cumulativeGasUsed, logsBloom, logs]
			const receiptArray = [
				// Status (post-Byzantium) or state root (pre-Byzantium)
				'stateRoot' in receipt && receipt.stateRoot
					? receipt.stateRoot
					: hexToBytes(numberToHex('status' in receipt ? receipt.status : 1)),
				// Cumulative gas used
				hexToBytes(numberToHex(receipt.cumulativeBlockGasUsed)),
				// Logs bloom (bitvector)
				receipt.bitvector,
				// Logs
				receipt.logs,
			]

			const encoded = Rlp.encode(receiptArray)
			return bytesToHex(encoded)
		})

		logger.debug({ encodedCount: encodedReceipts.length }, 'debugGetRawReceiptsHandler: successfully encoded receipts')

		return encodedReceipts
	}
