/**
 * Native Log types for decoded event logs.
 * These types replace viem's Log types for a more minimal dependency footprint.
 */

import type { Address, Hex } from './abitype.js'

/**
 * Hash type (32-byte hex string).
 */
export type Hash = Hex

/**
 * Log topic type - can be a single hex value, array of hex values, or null.
 */
export type LogTopic = Hex | Hex[] | null

/**
 * Decoded event log object.
 * Represents a log that has been decoded from the EVM.
 *
 * This is a simplified version of viem's Log type that covers
 * the common use cases without complex conditional generics.
 *
 * @example
 * ```ts
 * const log: Log = {
 *   address: '0x...',
 *   blockHash: '0x...',
 *   blockNumber: 123n,
 *   data: '0x...',
 *   logIndex: 0,
 *   transactionHash: '0x...',
 *   transactionIndex: 0,
 *   removed: false,
 *   topics: ['0x...'],
 *   // Optional decoded fields
 *   eventName: 'Transfer',
 *   args: { from: '0x...', to: '0x...', value: 100n }
 * }
 * ```
 */
export type Log<
	TQuantity = bigint,
	TIndex = number,
	TPending extends boolean = boolean,
> = {
	/** The address from which this log originated */
	address: Address
	/** Hash of block containing this log or `null` if pending */
	blockHash: TPending extends true ? null : Hash | null
	/** Number of block containing this log or `null` if pending */
	blockNumber: TPending extends true ? null : TQuantity | null
	/** Contains the non-indexed arguments of the log */
	data: Hex
	/** Index of this log within its block or `null` if pending */
	logIndex: TPending extends true ? null : TIndex | null
	/** Hash of the transaction that created this log or `null` if pending */
	transactionHash: TPending extends true ? null : Hash | null
	/** Index of the transaction that created this log or `null` if pending */
	transactionIndex: TPending extends true ? null : TIndex | null
	/** `true` if this filter has been destroyed and is invalid */
	removed: boolean
	/** List of order-dependent topics */
	topics: [] | [Hex, ...Hex[]]
	/** The decoded event name (if decoded) */
	eventName?: string
	/** The decoded event arguments (if decoded) */
	args?: Record<string, unknown>
}
