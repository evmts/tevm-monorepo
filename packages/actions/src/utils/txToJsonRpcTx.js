import { bytesToHex, numberToHex } from '@tevm/utils'

/**
 * @param {import('@tevm/tx').TypedTransaction | import('@tevm/tx').ImpersonatedTx} tx
 * @param {import('@tevm/block').Block} block
 * @param {number} [txIndex]
 * @returns {import('../common/TransactionResult.js').TransactionResult}
 */
export const txToJsonRpcTx = (tx, block, txIndex) => {
	const txJSON = tx.toJSON()
	// TODO make this typing less janky
	return /** @type {import('../common/TransactionResult.js').TransactionResult} */ ({
		blockHash: bytesToHex(block.hash()),
		blockNumber: numberToHex(block.header.number),
		from: /** @type {import('@tevm/utils').Address}*/ (tx.getSenderAddress().toString()),
		gas: /** @type {import('@tevm/utils').Hex} **/ (txJSON.gasLimit),
		gasPrice: /** @type {import('@tevm/utils').Hex}*/ (txJSON.gasPrice ?? txJSON.maxFeePerGas),
		maxFeePerGas: txJSON.maxFeePerGas,
		maxPriorityFeePerGas: txJSON.maxPriorityFeePerGas,
		type: numberToHex(tx.type),
		...(txJSON.accessList !== undefined ? { accessList: txJSON.accessList } : {}),
		hash: bytesToHex(tx.hash()),
		input: /** @type {import('@tevm/utils').Hex} */ (txJSON.data),
		nonce: /** @type {import('@tevm/utils').Hex}*/ (txJSON.nonce),
		// these toString existed in ethereumjs but I don't think are necessary
		...(txJSON.to !== undefined ? { to: /** @type {import('@tevm/utils').Address} */ (txJSON.to.toString()) } : {}),
		...(txIndex !== undefined ? { transactionIndex: numberToHex(txIndex) } : {}),
		...(txJSON.value !== undefined
			? { value: typeof txJSON.value === 'string' ? txJSON.value : numberToHex(txJSON.value) }
			: {}),
		...('isImpersonated' in tx ? { isImpersonated: tx.isImpersonated } : {}),
		...(txJSON.v !== undefined ? { v: txJSON.v } : {}),
		...(txJSON.r !== undefined ? { r: txJSON.r } : {}),
		...(txJSON.s !== undefined ? { s: txJSON.s } : {}),
		...(txJSON.chainId !== undefined
			? { chainId: typeof txJSON.chainId === 'string' ? txJSON.chainId : numberToHex(txJSON.chainId) }
			: {}),
		maxFeePerBlobGas: txJSON.maxFeePerBlobGas,
		blobVersionedHashes: txJSON.blobVersionedHashes,
	})
}
