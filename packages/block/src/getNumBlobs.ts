import { BlobEIP4844Transaction } from '@tevm/tx'

import type { TypedTransaction } from '@tevm/tx'

export const getNumBlobs = (transactions: TypedTransaction[]) => {
	let numBlobs = 0
	for (const tx of transactions) {
		if (tx instanceof BlobEIP4844Transaction) {
			numBlobs += tx.blobVersionedHashes.length
		}
	}
	return numBlobs
}
