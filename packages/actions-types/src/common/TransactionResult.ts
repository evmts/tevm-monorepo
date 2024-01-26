import type { Hex } from './Hex.js'

/**
 * The type returned by transaction related
 * json rpc procedures
 */
export type TransactionResult = {
	readonly blockHash: Hex
	readonly blockNumber: Hex
	readonly from: Hex
	readonly gas: Hex
	readonly gasPrice: Hex
	readonly hash: Hex
	readonly input: Hex
	readonly nonce: Hex
	readonly to: Hex
	readonly transactionIndex: Hex
	readonly value: Hex
	readonly v: Hex
	readonly r: Hex
	readonly s: Hex
}
