import type { Hex } from '@tevm/utils'

/**
 * An object with the block header's data represented as 0x-prefixed hex strings.
 */
// TODO: Remove the string type and only keep Hex
export interface JsonHeader {
	parentHash?: Hex | string
	uncleHash?: Hex | string
	coinbase?: Hex | string
	stateRoot?: Hex | string
	transactionsTrie?: Hex | string
	receiptTrie?: Hex | string
	logsBloom?: Hex | string
	difficulty?: Hex | string
	number?: Hex | string
	gasLimit?: Hex | string
	gasUsed?: Hex | string
	timestamp?: Hex | string
	extraData?: Hex | string
	mixHash?: Hex | string
	nonce?: Hex | string
	baseFeePerGas?: Hex | string
	withdrawalsRoot?: Hex | string
	blobGasUsed?: Hex | string
	excessBlobGas?: Hex | string
	parentBeaconBlockRoot?: Hex | string
	requestsRoot?: Hex | string
}
