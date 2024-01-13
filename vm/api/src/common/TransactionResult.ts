import type { Hex } from 'viem'

/**
 * The type returned by transaction related
 * json rpc procedures
 */
export type TransactionResult = {
	blockHash: Hex
	blockNumber: Hex
	from: Hex
	gas: Hex
	gasPrice: Hex
	hash: Hex
	input: Hex
	nonce: Hex
	to: Hex
	transactionIndex: Hex
	value: Hex
	v: Hex
	r: Hex
	s: Hex
}
