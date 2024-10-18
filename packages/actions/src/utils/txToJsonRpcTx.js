import { bytesToHex, numberToHex } from '@tevm/utils'

/**
 * @param {import('@tevm/tx').TypedTransaction | import('@tevm/tx').ImpersonatedTx} tx
 * @param {import('@tevm/block').Block} block
 * @param {number} [txIndex]
 * @returns {import('../common/TransactionResult.js').TransactionResult}
 */
export const txToJSONRPCTx = (tx, block, txIndex) => {
	const txJSON = tx.toJSON()
	// TODO make this typing less janky
	return /** @type any*/ ({
		blockHash: bytesToHex(block.hash()),
		blockNumber: numberToHex(block.header.number),
		from: /** @type {import('@tevm/utils').Address}*/ (tx.getSenderAddress().toString()),
		gas: /** @type {import('@tevm/utils').Hex} **/ (txJSON.gasLimit),
		gasPrice: /** @type {import('@tevm/utils').Hex}*/ (txJSON.gasPrice ?? txJSON.maxFeePerGas),
		// TODO add this to the type
		...{ maxFeePerGas: txJSON.maxFeePerGas },
		// TODO add this to the type
		...{ maxPriorityFeePerGas: txJSON.maxPriorityFeePerGas },
		// TODO add this to the type
		...{ type: numberToHex(tx.type) },
		...(txJSON.accessList !== undefined ? { accessList: txJSON.accessList } : {}),
		hash: bytesToHex(tx.hash()),
		data: /** @type {import('@tevm/utils').Hex} */ (txJSON.data),
		nonce: /** @type {import('@tevm/utils').Hex}*/ (txJSON.nonce),
		// these toString existed in ethereumjs but I don't think are necessary
		...(txJSON.to !== undefined ? { to: /** @type {import('@tevm/utils').Address} */ (txJSON.to.toString()) } : {}),
		...(txIndex !== undefined ? { transactionIndex: numberToHex(txIndex) } : {}),
		...(txJSON.value !== undefined ? { value: txJSON.value } : {}),
		...('isImpersonated' in tx ? { isImpersonated: tx.isImpersonated } : {}),
		...(txJSON.v !== undefined ? { v: txJSON.v } : {}),
		...(txJSON.r !== undefined ? { r: txJSON.r } : {}),
		...(txJSON.s !== undefined ? { s: txJSON.s } : {}),
		// TODO add this to the type
		...{ maxFeePerBlobGas: txJSON.maxFeePerBlobGas },
		// TODO add this to the type
		...{ blobVersionedHashes: txJSON.blobVersionedHashes },
	})
}
