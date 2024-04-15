import { createJsonRpcFetcher } from '@tevm/jsonrpc'
import { bytesToHex, hexToBytes } from '@tevm/utils'

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
 * @param {import('@tevm/base-client').BaseClient} client
 * @returns {import('@tevm/actions-types').EthGetTransactionReceiptHandler}
 */
export const ethGetTransactionReceiptHandler = (client) => async (params) => {
	client.logger.debug(
		params,
		'ethGetTransactionReceiptHandler called with params',
	)

	const receiptsManager = await client.getReceiptsManager()
	const chain = await client.getChain()
	const vm = await client.getVm().then((vm) => vm.shallowCopy())

	const result = await receiptsManager.getReceiptByTxHash(
		hexToBytes(params.hash),
	)

	client.logger.debug(
		result,
		result
			? 'Found a receipt in receiptsManager cache'
			: 'No initial receipt found in receiptsManager cache',
	)

	/**
	 * If we don't have the receipt check the fork for a receipt
	 * We currently do not cache it in future we may consider fetching
	 * entire block here and caching it
	 */
	if (!result && client.forkUrl) {
		const fetcher = createJsonRpcFetcher(client.forkUrl)
		client.logger.debug(
			{ hash: params.hash, forkUrl: client.forkUrl },
			'fetching receipt from forkUrl',
		)
		const { result } = await fetcher.request({
			method: 'eth_getTransactionReceipt',
			params: [params.hash],
			id: 1,
			jsonrpc: '2.0',
		})
		client.logger.debug(result, 'forkUrl receipt result')
		// TODO type this
		const r = /** @type {any}*/ (result)
		/**
		 * @type {import('@tevm/actions-types').EthGetTransactionReceiptResult }
		 */
		const out = r && {
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
		client.logger.debug(
			out,
			'Converted jsonrpc response to tevm receipt result type',
		)
		return out
	}

	if (!result) {
		client.logger.debug(null, 'No receipt found. Returning null')
		return null
	}

	const [receipt, blockHash, txIndex, logIndex] = result
	const block = await chain.getBlock(blockHash)
	client.logger.debug(block, 'Fetched block from chain')
	const blockByNumber = await chain.getBlock(block.header.number)
	if (!uintEquals(blockByNumber.hash(), block.hash())) {
		client.logger.debug(
			blockByNumber,
			'Block does not match the block in the cannonical chain. Returning null',
		)
		return null
	}

	const parentBlock = await chain.getBlock(block.header.parentHash)
	client.logger.debug(parentBlock, 'fetched parent block')
	const tx = block.transactions[txIndex]
	if (!tx) {
		const message =
			'No tx found in block.transactions. This may indicate an unimplemented feature if tx is in the forkUrl'
		client.logger.error(tx, message)
		// TODO check proxy url
		throw {
			// TODO wrong code
			code: -32602,
			message,
		}
	}
	// TODO handle legacy tx
	const effectiveGasPrice =
		/** @type any*/ (tx).maxPriorityFeePerGas <
		/** @type any*/ (tx).maxFeePerGas - (block.header.baseFeePerGas ?? 0n)
			? /** @type any*/ (tx).maxPriorityFeePerGas
			: /** @type any*/ (tx).maxFeePerGas -
			  (block.header.baseFeePerGas ?? 0n) +
			  (block.header.baseFeePerGas ?? 0n)

	client.logger.debug(effectiveGasPrice, 'calculated the effective gas price')

	vm.common.setHardfork(tx.common.hardfork())
	// Run tx through copied vm to get tx gasUsed and createdAddress
	const runBlockResult = await vm.runBlock({
		block,
		root: parentBlock.header.stateRoot,
		skipBlockValidation: true,
	})

	client.logger.debug(runBlockResult, 'result from executing the block')

	const res = runBlockResult.results[txIndex]
	if (!res) {
		throw new Error('No result for tx this indicates a bug in the client')
	}
	const { totalGasSpent, createdAddress } = res
	const { blobGasPrice, blobGasUsed } = /** @type {any}*/ (
		runBlockResult.receipts[txIndex]
	)
	/**
	 * @type {import('@tevm/actions-types').EthGetTransactionReceiptResult }
	 */
	const out = {
		blockHash: bytesToHex(block.hash()),
		blockNumber: block.header.number,
		cumulativeGasUsed: receipt.cumulativeBlockGasUsed,
		// TODO add this to the type
		...{ effectiveGasPrice: effectiveGasPrice },
		from: /** @type {import('@tevm/utils').Address}*/ (
			tx.getSenderAddress().toString()
		),
		gasUsed: totalGasSpent,
		to: /** @type {import('@tevm/utils').Address}*/ (tx.to?.toString() ?? '0x'),
		transactionHash: bytesToHex(tx.hash()),
		transactionIndex: BigInt(txIndex),
		contractAddress:
			/** @type {import('@tevm/utils').Address}*/ (
				createdAddress?.toString()
			) ?? null,
		logsBloom: bytesToHex(receipt.bitvector),
		blobGasUsed: blobGasUsed !== undefined ? blobGasUsed : undefined,
		blobGasPrice: blobGasPrice !== undefined ? blobGasPrice : undefined,
		// TODO add this to the type
		...{
			root:
				/** @type any*/ (receipt).stateRoot instanceof Uint8Array
					? bytesToHex(/** @type any*/ (receipt).stateRoot)
					: undefined,
		},
		status:
			/** @type any*/ (receipt).status instanceof Uint8Array
				? /** @type any*/ (receipt).status
				: undefined,
		logs: await Promise.all(
			receipt.logs.map((log, i) => ({
				address: bytesToHex(log[0]),
				blockHash: /** @type {import('@tevm/utils').Hex}*/ (
					block ? bytesToHex(block.hash()) : null
				),
				blockNumber: /** @type {bigint}*/ (block ? block.header.number : null),
				data: bytesToHex(log[2]),
				logIndex: BigInt(logIndex + i),
				removed: false,
				topics: log[1].map((bytes) => bytesToHex(bytes)),
				transactionIndex: /** @type {bigint}*/ (
					txIndex !== undefined ? BigInt(txIndex) : null
				),
				transactionHash: /** @type {import('@tevm/utils').Hex}*/ (
					tx !== undefined ? bytesToHex(tx.hash()) : null
				),
			})),
		),
	}

	client.logger.info(out, 'converted block and tx data to receipt')

	return out
}
