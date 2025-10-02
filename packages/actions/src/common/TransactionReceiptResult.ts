import type { FilterLog } from './FilterLog.js'
import type { Hex } from './Hex.js'

/**
 * Transaction receipt result type for eth JSON-RPC procedures
 */
export type TransactionReceiptResult = {
	readonly blockHash: Hex
	readonly blockNumber: bigint
	readonly contractAddress: Hex | null
	readonly cumulativeGasUsed: bigint
	readonly effectiveGasPrice: bigint
	readonly from: Hex
	readonly gasUsed: bigint
	readonly logs: readonly FilterLog[]
	readonly logsBloom: Hex
	readonly status?: Hex
	readonly root?: Hex
	readonly to: Hex | null
	readonly transactionHash: Hex
	readonly transactionIndex: bigint
	readonly blobGasUsed?: bigint
	readonly blobGasPrice?: bigint
}
