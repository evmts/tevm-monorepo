import { BlobEIP4844Transaction } from '@tevm/tx'

/**
 * @param {ReadonlyArray<import('@tevm/tx').TypedTransaction>} transactions
 */
export const getNumBlobs = (transactions) => {
	let numBlobs = 0
	for (const tx of transactions) {
		if (tx instanceof BlobEIP4844Transaction) {
			numBlobs += tx.blobVersionedHashes.length
		}
	}
	return numBlobs
}
