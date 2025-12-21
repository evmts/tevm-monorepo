import { createJsonRpcFetcher } from '@tevm/jsonrpc'
import { bytesToHex, hexToBigInt, hexToBytes, numberToHex } from '@tevm/utils'

/**
 * @param {Uint8Array} a
 * @param {Uint8Array} b
 */
const uintEquals = (a, b) => {
	if (a.length !== b.length) {
		return false
	}

	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) {
			return false
		}
	}

	return true
}

/**
 * Retrieves all transaction receipts for a given block.
 *
 * This handler provides efficient bulk retrieval of receipts for all transactions in a block.
 * It supports both block numbers and block hashes as identifiers.
 *
 * @param {import('@tevm/node').TevmNode} client - The Tevm client instance
 * @returns {import('./EthHandler.js').EthGetBlockReceiptsHandler} The handler function
 * @throws {Error} If the block is not found or if there's an error processing receipts
 *
 * @example
 * ```javascript
 * import { createTevmNode } from '@tevm/node'
 * import { ethGetBlockReceiptsHandler } from '@tevm/actions'
 *
 * const client = await createTevmNode()
 * const handler = ethGetBlockReceiptsHandler(client)
 *
 * // Get receipts by block number
 * const receipts = await handler({ blockTag: 1000n })
 *
 * // Get receipts by block hash
 * const receiptsByHash = await handler({
 *   blockHash: '0x1234567890abcdef...'
 * })
 * ```
 */
export const ethGetBlockReceiptsHandler = (client) => async (params) => {
	const _receiptsManager = await client.getReceiptsManager()
	const vm = await client.getVm().then((vm) => vm.deepCopy())

	// Determine block identifier and retrieve block
	let block
	if (params.blockHash) {
		// Block identified by hash
		try {
			block = await vm.blockchain.getBlock(hexToBytes(params.blockHash))
		} catch (err) {
			client.logger.debug({ blockHash: params.blockHash, err }, 'Block not found by hash, checking fork transport')
		}
	} else if (params.blockTag !== undefined) {
		// Block identified by tag or number
		try {
			if (typeof params.blockTag === 'bigint') {
				block = await vm.blockchain.getBlock(params.blockTag)
			} else if (typeof params.blockTag === 'string') {
				if (params.blockTag.startsWith('0x')) {
					block = await vm.blockchain.getBlock(hexToBigInt(/** @type {import('@tevm/utils').Hex} */ (params.blockTag)))
				} else {
					block = await vm.blockchain.blocksByTag.get(/** @type {import('@tevm/utils').BlockTag} */ (params.blockTag))
				}
			}
		} catch (err) {
			client.logger.debug({ blockTag: params.blockTag, err }, 'Block not found by tag/number, checking fork transport')
		}
	}

	// If we don't have the block locally, check the fork
	if (!block && client.forkTransport) {
		const fetcher = createJsonRpcFetcher(client.forkTransport)
		const blockId =
			params.blockHash ?? (typeof params.blockTag === 'bigint' ? numberToHex(params.blockTag) : params.blockTag)
		const { result } = await fetcher.request({
			method: 'eth_getBlockReceipts',
			params: [blockId],
			id: 1,
			jsonrpc: '2.0',
		})

		// TODO: Properly type the fork result
		const receipts = /** @type {any} */ (result)
		if (!receipts) {
			return null
		}

		// Map fork result to our format
		return receipts.map(
			/**
			 * @param {any} r
			 * @returns {import('./EthResult.js').EthGetTransactionReceiptResult}
			 */
			(r) => ({
				blockHash: r.blockHash,
				blockNumber: BigInt(r.blockNumber),
				cumulativeGasUsed: BigInt(r.cumulativeGasUsed),
				effectiveGasPrice: BigInt(r.effectiveGasPrice),
				from: r.from,
				gasUsed: BigInt(r.gasUsed),
				to: r.to,
				transactionHash: r.transactionHash,
				transactionIndex: BigInt(r.transactionIndex),
				contractAddress: r.contractAddress,
				logsBloom: r.logsBloom,
				blobGasUsed: r.blobGasUsed ? BigInt(r.blobGasUsed) : undefined,
				blobGasPrice: r.blobGasPrice ? BigInt(r.blobGasPrice) : undefined,
				root: r.root,
				status: r.status,
				logs: r.logs.map(
					/**
					 * @param {any} log
					 */
					(log) => ({
						address: log.address,
						blockHash: log.blockHash,
						blockNumber: BigInt(log.blockNumber),
						data: log.data,
						logIndex: BigInt(log.logIndex),
						removed: log.removed,
						topics: log.topics,
						transactionIndex: BigInt(log.transactionIndex),
						transactionHash: log.transactionHash,
					}),
				),
			}),
		)
	}

	if (!block) {
		client.logger.debug({ params }, 'Block not found')
		return null
	}

	// Check if block is in canonical chain
	const blockByNumber = await vm.blockchain.getBlock(block.header.number)
	if (!uintEquals(blockByNumber.hash(), block.hash())) {
		client.logger.debug(
			{ blockNumber: block.header.number, blockHash: bytesToHex(block.hash()) },
			'Block is not in canonical chain',
		)
		return null
	}

	// If block has no transactions, return empty array
	if (block.transactions.length === 0) {
		return []
	}

	const parentBlock = await vm.blockchain.getBlock(block.header.parentHash)

	// Set common hardfork for the block
	const firstTx = block.transactions[0]
	if (firstTx) {
		vm.common.ethjsCommon.setHardfork(firstTx.common.hardfork())
	}
	await vm.stateManager.setStateRoot(parentBlock.header.stateRoot)

	// Run the entire block to get all receipts at once
	const runBlockResult = await vm.runBlock({
		block,
		root: parentBlock.header.stateRoot,
		skipBlockValidation: true,
	})

	/**
	 * @type {import('./EthResult.js').EthGetTransactionReceiptResult[]}
	 */
	const receipts = []

	// Track cumulative log index across all transactions in block
	let cumulativeLogIndex = 0

	// Process each transaction and its receipt
	for (let txIndex = 0; txIndex < block.transactions.length; txIndex++) {
		const tx = block.transactions[txIndex]
		if (!tx) {
			continue
		}

		const result = runBlockResult.results[txIndex]
		const receipt = runBlockResult.receipts[txIndex]

		if (!result || !receipt) {
			client.logger.warn({ txIndex, blockNumber: block.header.number }, 'Missing result or receipt for transaction')
			continue
		}

		const { totalGasSpent, createdAddress } = result
		const { blobGasPrice, blobGasUsed } = /** @type {any} */ (receipt)

		// Calculate effective gas price
		const effectiveGasPrice =
			/** @type {any} */ (tx).maxPriorityFeePerGas !== undefined && /** @type {any} */ (tx).maxFeePerGas !== undefined
				? /** @type {any} */ (tx).maxPriorityFeePerGas <
					/** @type {any} */ (tx).maxFeePerGas - (block.header.baseFeePerGas ?? 0n)
					? /** @type {any} */ (tx).maxPriorityFeePerGas + (block.header.baseFeePerGas ?? 0n)
					: /** @type {any} */ (tx).maxFeePerGas
				: /** @type {any} */ (tx.gasPrice ?? 0n)

		receipts.push({
			blockHash: bytesToHex(block.hash()),
			blockNumber: block.header.number,
			cumulativeGasUsed: receipt.cumulativeBlockGasUsed,
			effectiveGasPrice: effectiveGasPrice,
			from: tx.getSenderAddress().toString(),
			gasUsed: totalGasSpent,
			to: tx.to?.toString() ?? null,
			transactionHash: bytesToHex(tx.hash()),
			transactionIndex: BigInt(txIndex),
			contractAddress: createdAddress?.toString() ?? null,
			logsBloom: bytesToHex(receipt.bitvector),
			blobGasUsed: blobGasUsed !== undefined ? blobGasUsed : undefined,
			blobGasPrice: blobGasPrice !== undefined ? blobGasPrice : undefined,
			root:
				/** @type {any} */ (receipt).stateRoot instanceof Uint8Array
					? bytesToHex(/** @type {any} */ (receipt).stateRoot)
					: undefined,
			status:
				/** @type {any} */ (receipt).status instanceof Uint8Array
					? numberToHex(/** @type {any} */ (receipt).status[0])
					: typeof (/** @type {any} */ (receipt).status) === 'number'
						? numberToHex(/** @type {any} */ (receipt).status)
						: undefined,
			logs: receipt.logs.map((log, i) => ({
				address: bytesToHex(log[0]),
				blockHash: bytesToHex(block.hash()),
				blockNumber: block.header.number,
				data: bytesToHex(log[2]),
				logIndex: BigInt(cumulativeLogIndex + i),
				removed: false,
				topics: log[1].map((bytes) => bytesToHex(bytes)),
				transactionIndex: BigInt(txIndex),
				transactionHash: bytesToHex(tx.hash()),
			})),
		})

		cumulativeLogIndex += receipt.logs.length
	}

	return receipts
}
