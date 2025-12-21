import type { Block } from '@tevm/block'
import type { TypedTransaction } from '@tevm/tx'
import { type Hex } from '@tevm/utils'

export type FilterType = 'PendingTransaction' | 'Block' | 'Log'

type TODO = any

/**
 * Log entry stored in a filter
 * Uses bigint for blockNumber, logIndex, and transactionIndex for consistency with TEVM's internal types
 */
export type FilterLog = {
	/**
	 * Address that emitted the log
	 */
	address: Hex
	/**
	 * Block hash containing the log
	 */
	blockHash: Hex
	/**
	 * Block number containing the log
	 */
	blockNumber: bigint
	/**
	 * Non-indexed log data
	 */
	data: Hex
	/**
	 * Index of the log within the block
	 */
	logIndex: bigint
	/**
	 * Whether the log was removed due to a chain reorganization
	 */
	removed: boolean
	/**
	 * Indexed log topics
	 */
	topics: [Hex, ...Hex[]]
	/**
	 * Transaction hash that created the log
	 */
	transactionHash: Hex
	/**
	 * Index of the transaction within the block
	 */
	transactionIndex: bigint
}

// Adapted from go-ethereum/blob/master/eth/filters/filter_system.go#L359
/**
 * Internal representation of a registered filter
 */
export type Filter = {
	/**
	 * Id of the filter
	 */
	id: Hex
	/**
	 * The type of the filter
	 */
	type: FilterType
	/**
	 * Creation timestamp
	 */
	created: number
	/**
	 * Criteria of the logs
	 * https://github.com/ethereum/go-ethereum/blob/master/eth/filters/filter_system.go#L329
	 */
	logsCriteria?: TODO
	/**
	 * Stores logs
	 */
	logs: Array<FilterLog>
	/**
	 * stores tx
	 */
	tx: Array<TypedTransaction>
	/**
	 * Stores the blocks
	 */
	blocks: Array<Block>
	/**
	 * Not sure what this is yet
	 */
	installed: {}
	/**
	 * Error if any
	 */
	err: Error | undefined
	/**
	 * Listeners registered for the filter
	 */
	registeredListeners: Array<(...args: Array<any>) => any>
}
