import type { FilterLog } from './FilterLog.js'
import type { Hex } from './Hex.js'

/**
 * Transaction receipt result type for eth JSON-RPC procedures
 */
export type TransactionReceiptResult = {
	readonly blockHash: Hex
	readonly blockNumber: Hex
	readonly contractAddress: Hex
	readonly cumulativeGasUsed: Hex
	readonly from: Hex
	readonly gasUsed: Hex
	readonly logs: readonly FilterLog[]
	readonly logsBloom: Hex
	readonly status: Hex
	readonly to: Hex
	readonly transactionHash: Hex
	readonly transactionIndex: Hex
}
