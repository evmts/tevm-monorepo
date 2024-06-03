// This file is originally adapted from ethereumjs and thus carries the same license
import type { AddressLike, BigIntLike, BytesLike } from '@tevm/utils'

/**
 * A block header's data.
 */
// TODO: Deprecate the string type and only keep BytesLike/AddressLike/BigIntLike
export interface HeaderData {
	parentHash?: BytesLike | string
	uncleHash?: BytesLike | string
	coinbase?: AddressLike | string
	stateRoot?: BytesLike | string
	transactionsTrie?: BytesLike | string
	receiptTrie?: BytesLike | string
	logsBloom?: BytesLike | string
	difficulty?: BigIntLike | string
	number?: BigIntLike | string
	gasLimit?: BigIntLike | string
	gasUsed?: BigIntLike | string
	timestamp?: BigIntLike | string
	extraData?: BytesLike | string
	mixHash?: BytesLike | string
	nonce?: BytesLike | string
	baseFeePerGas?: BigIntLike | string
	withdrawalsRoot?: BytesLike | string
	blobGasUsed?: BigIntLike | string
	excessBlobGas?: BigIntLike | string
	parentBeaconBlockRoot?: BytesLike | string
	requestsRoot?: BytesLike | string
}
