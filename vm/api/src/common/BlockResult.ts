import type { Hex } from 'viem'

/**
 * The type returned by block related
 * json rpc procedures
 */
export type BlockResult = {
	number: Hex
	hash: Hex
	parentHash: Hex
	nonce: Hex
	sha3Uncles: Hex
	logsBloom: Hex
	transactionsRoot: Hex
	stateRoot: Hex
	miner: Hex
	difficulty: Hex
	totalDifficulty: Hex
	extraData: Hex
	size: Hex
	gasLimit: Hex
	gasUsed: Hex
	timestamp: Hex
	transactions: Hex[]
	uncles: Hex[]
}
