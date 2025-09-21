import { createJsonRpcFetcher } from '@tevm/jsonrpc'
import { bytesToHex, hexToBytes, numberToHex } from '@tevm/utils'

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
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./EthHandler.js').EthGetTransactionReceiptHandler}
 */
export const ethGetTransactionReceiptHandler = (client) => async (params) => {
	const receiptsManager = await client.getReceiptsManager()
	const vm = await client.getVm().then((vm) => vm.deepCopy())

	const result = await receiptsManager.getReceiptByTxHash(hexToBytes(params.hash))

	/**
	 * If we don't have the receipt check the fork for a receipt
	 * We currently do not cache it in future we may consider fetching
	 * entire block here and caching it
	 */
	if (!result && client.forkTransport) {
		const fetcher = createJsonRpcFetcher(client.forkTransport)
		const { result } = await fetcher.request({
			method: 'eth_getTransactionReceipt',
			params: [params.hash],
			id: 1,
			jsonrpc: '2.0',
		})
		// TODO type this
		const r = /** @type {any}*/ (result)
		/**
		 * @type {import('./EthResult.js').EthGetTransactionReceiptResult }
		 */
		return (
			r && {
				blockHash: r.hex,
				blockNumber: BigInt(r.blockNumber),
				cumulativeGasUsed: BigInt(r.cumulativeBlockGasUsed),
				effectiveGasPrice: BigInt(r.effectiveGasPrice),
				from: r.from,
				gasUsed: BigInt(r.gasUsed),
				to: r.to,
				transactionHash: r.transactionHash,
				transactionIndex: BigInt(r.transactionIndex),
				contractAddress: r.contractAddress,
				logsBloom: r.logsBloom,
				blobGasUsed: BigInt(r.blobGasUsed),
				blobGasPrice: BigInt(r.blobGasPrice),
				root: r.root,
				status: r.status,
				logs: r.logs.map(
					/**
					 * TODO type this
					 * @param {any} log
					 */
					(log) => ({
						address: log.address,
						blockHash: log.blockHash,
						blockNumber: BigInt(log.blockNumber),
						data: log.data,
						logIndex: log.logIndex,
						removed: log.removed,
						topics: log.topics,
						transactionIndex: BigInt(log.transactionIndex),
						transactionHash: log.transactionHash,
					}),
				),
			}
		)
	}

	if (!result) {
		return null
	}

	const [receipt, blockHash, txIndex, logIndex] = result
	const block = await vm.blockchain.getBlock(blockHash)
	// Check if block is in canonical chain
	const blockByNumber = await vm.blockchain.getBlock(block.header.number)
	if (!uintEquals(blockByNumber.hash(), block.hash())) {
		return null
	}

	const parentBlock = await vm.blockchain.getBlock(block.header.parentHash)
	const tx = block.transactions[txIndex]
	if (!tx) {
		// TODO check proxy url
		throw {
			// TODO wrong code
			code: -32602,
			message: 'No tx found',
		}
	}
	// TODO handle legacy tx
	const effectiveGasPrice =
		/** @type any*/ (tx).maxPriorityFeePerGas < /** @type any*/ (tx).maxFeePerGas - (block.header.baseFeePerGas ?? 0n)
			? /** @type any*/ (tx).maxPriorityFeePerGas
			: /** @type any*/ (tx).maxFeePerGas - (block.header.baseFeePerGas ?? 0n) + (block.header.baseFeePerGas ?? 0n)

	vm.common.ethjsCommon.setHardfork(tx.common.hardfork())
	await vm.stateManager.setStateRoot(parentBlock.header.stateRoot)
	// Run tx through copied vm to get tx gasUsed and createdAddress
	const runBlockResult = await vm.runBlock({
		block,
		root: parentBlock.header.stateRoot,
		skipBlockValidation: true,
	})

	const res = runBlockResult.results[txIndex]
	if (!res) {
		throw new Error('No result for tx this indicates a bug in the client')
	}
	const { totalGasSpent, createdAddress } = res
	const { blobGasPrice, blobGasUsed } = /** @type {any}*/ (runBlockResult.receipts[txIndex])
	/**
	 * @type {import('./EthResult.js').EthGetTransactionReceiptResult}
	 */
	return {
		blockHash: bytesToHex(block.hash()),
		blockNumber: block.header.number,
		cumulativeGasUsed: receipt.cumulativeBlockGasUsed,
		effectiveGasPrice: effectiveGasPrice,
		from: tx.getSenderAddress().toString(),
		gasUsed: totalGasSpent,
		to: tx.to?.toString() ?? '0x',
		transactionHash: bytesToHex(tx.hash()),
		transactionIndex: txIndex,
		contractAddress: createdAddress?.toString() ?? null,
		logsBloom: bytesToHex(receipt.bitvector),
		blobGasUsed: blobGasUsed !== undefined ? blobGasUsed : undefined,
		blobGasPrice: blobGasPrice !== undefined ? blobGasPrice : undefined,
		root:
			/** @type any*/ (receipt).stateRoot instanceof Uint8Array
				? bytesToHex(/** @type any*/ (receipt).stateRoot)
				: undefined,
		status:
			typeof (/** @type any*/ (receipt).status) === 'number'
				? numberToHex(/** @type any*/ (receipt).status)
				: undefined,
		logs: await Promise.all(
			receipt.logs.map((log, i) => ({
				address: bytesToHex(log[0]),
				blockHash: block ? bytesToHex(block.hash()) : null,
				blockNumber: block ? block.header.number : null,
				data: bytesToHex(log[2]),
				logIndex: logIndex + i,
				removed: false,
				topics: log[1].map((bytes) => bytesToHex(bytes)),
				transactionIndex: txIndex !== undefined ? txIndex : null,
				transactionHash: tx !== undefined ? bytesToHex(tx.hash()) : null,
			})),
		),
	}
}
