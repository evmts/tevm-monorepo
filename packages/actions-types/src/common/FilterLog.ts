import type { Hex } from './Hex.js'

/**
 * FilterLog type for eth JSON-RPC procedures
 */
export type FilterLog = {
	readonly address: Hex
	readonly blockHash: Hex
	readonly blockNumber: Hex
	readonly data: Hex
	readonly logIndex: Hex
	readonly removed: boolean
	readonly topics: readonly Hex[]
	readonly transactionHash: Hex
	readonly transactionIndex: Hex
}
