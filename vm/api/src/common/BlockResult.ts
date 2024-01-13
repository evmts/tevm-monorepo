import type { Hex } from 'viem'

/**
 * The type returned by block related
 * json rpc procedures
 */
export type BlockResult = {
	readonly number: Hex
	readonly hash: Hex
	readonly parentHash: Hex
	readonly nonce: Hex
	readonly sha3Uncles: Hex
	readonly logsBloom: Hex
	readonly transactionsRoot: Hex
	readonly stateRoot: Hex
	readonly miner: Hex
	readonly difficulty: Hex
	readonly totalDifficulty: Hex
	readonly extraData: Hex
	readonly size: Hex
	readonly gasLimit: Hex
	readonly gasUsed: Hex
	readonly timestamp: Hex
	readonly transactions: Hex[]
	readonly uncles: Hex[]
}
