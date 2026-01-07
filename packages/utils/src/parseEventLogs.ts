/**
 * Native parseEventLogs function to parse multiple event logs from transaction receipts.
 * This provides the same API as viem's parseEventLogs but uses @tevm/voltaire internally.
 * @module
 */

import type { Abi } from 'abitype'
import type { Hex, Address } from './abitype.js'
import type { Log } from './log-types.js'
import { decodeEventLog } from './abiEventEncoding.js'

/**
 * Parameters for parseEventLogs function.
 */
export type ParseEventLogsParameters<
	TAbi extends Abi | readonly unknown[] = Abi,
	TEventName extends string | undefined = string | undefined,
	TStrict extends boolean = true,
> = {
	/** The contract ABI */
	abi: TAbi
	/** The event name to filter by (optional) */
	eventName?: TEventName
	/** The logs to parse */
	logs: readonly {
		address?: Address | undefined
		blockHash?: Hex | null | undefined
		blockNumber?: bigint | null | undefined
		data?: Hex | undefined
		logIndex?: number | null | undefined
		transactionHash?: Hex | null | undefined
		transactionIndex?: number | null | undefined
		removed?: boolean | undefined
		topics?: readonly (Hex | null | undefined)[] | readonly Hex[] | undefined
	}[]
	/** Whether to throw on errors (default: true) */
	strict?: TStrict
	/** Args to filter by (optional) - filter logs that match these indexed parameters */
	args?: Record<string, unknown | unknown[]>
}

/**
 * Decoded event result from decodeEventLog.
 */
type DecodedEvent = {
	eventName: string
	args: Record<string, unknown>
}

/**
 * Return type for parseEventLogs function.
 */
export type ParseEventLogsReturnType<
	_TAbi extends Abi | readonly unknown[] = Abi,
	TEventName extends string | undefined = string | undefined,
> = (Log & {
	/** The decoded event name */
	eventName: TEventName extends string ? TEventName : string
	/** The decoded event arguments */
	args: Record<string, unknown>
})[]

/**
 * Parses event logs from transaction receipts.
 * Native implementation using @tevm/voltaire that matches viem's parseEventLogs API.
 *
 * @template TAbi - The ABI type
 * @template TEventName - The event name type (optional)
 * @template TStrict - Whether to use strict mode
 * @param options - The parsing options
 * @returns Array of decoded logs
 *
 * @example
 * ```javascript
 * import { parseEventLogs } from '@tevm/utils'
 *
 * // Parse all event logs from a transaction receipt
 * const logs = parseEventLogs({
 *   abi: erc20Abi,
 *   logs: receipt.logs,
 * })
 * // Returns: [
 * //   { args: { from: '0x...', to: '0x...', value: 100n }, eventName: 'Transfer', ... },
 * //   { args: { owner: '0x...', spender: '0x...' }, eventName: 'Approval', ... },
 * // ]
 * ```
 *
 * @example
 * ```javascript
 * // Filter by event name
 * const transferLogs = parseEventLogs({
 *   abi: erc20Abi,
 *   eventName: 'Transfer',
 *   logs: receipt.logs,
 * })
 * ```
 *
 * @example
 * ```javascript
 * // Filter by args
 * const logsFromAddress = parseEventLogs({
 *   abi: erc20Abi,
 *   eventName: 'Transfer',
 *   args: {
 *     from: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
 *   },
 *   logs: receipt.logs,
 * })
 * ```
 */
export function parseEventLogs<
	_TAbi extends Abi | readonly unknown[] = Abi,
	TEventName extends string | undefined = string | undefined,
	TStrict extends boolean = true,
>(
	options: ParseEventLogsParameters<_TAbi, TEventName, TStrict>,
): ParseEventLogsReturnType<_TAbi, TEventName> {
	const { abi, eventName, logs, strict = true, args: filterArgs } = options
	const result: ParseEventLogsReturnType<_TAbi, TEventName> = []

	for (const log of logs) {
		// Skip logs without topics or data
		if (!log.topics || log.topics.length === 0) continue
		if (log.data === undefined) continue

		try {
			// Filter topics to remove null/undefined values for decoding
			const filteredTopics = (log.topics as readonly (Hex | null | undefined)[]).filter(
				(t): t is Hex => t != null,
			)

			// Try to decode the log
			const decoded = decodeEventLog({
				abi: abi as Abi,
				topics: filteredTopics as readonly Hex[],
				data: log.data,
				eventName: eventName as string | undefined,
				strict: false, // We handle strict mode ourselves
			}) as DecodedEvent | undefined

			// Skip if decoding failed
			if (!decoded) continue

			// If eventName was provided, check it matches
			if (eventName !== undefined && decoded.eventName !== eventName) continue

			// Check filter args if provided
			if (filterArgs) {
				let matches = true
				for (const [key, filterValue] of Object.entries(filterArgs)) {
					const argValue = decoded.args?.[key]
					if (Array.isArray(filterValue)) {
						// For arrays, check if the arg matches any of the filter values
						if (!filterValue.some((fv) => argsEqual(argValue, fv))) {
							matches = false
							break
						}
					} else {
						// For single values, check direct equality
						if (!argsEqual(argValue, filterValue)) {
							matches = false
							break
						}
					}
				}
				if (!matches) continue
			}

			// Build the result log
			result.push({
				address: log.address as Address,
				blockHash: log.blockHash as Hex | null,
				blockNumber: log.blockNumber as bigint | null,
				data: log.data,
				logIndex: log.logIndex as number | null,
				transactionHash: log.transactionHash as Hex | null,
				transactionIndex: log.transactionIndex as number | null,
				removed: log.removed ?? false,
				topics: filteredTopics as [] | [Hex, ...Hex[]],
				eventName: decoded.eventName as TEventName extends string ? TEventName : string,
				args: decoded.args as Record<string, unknown>,
			})
		} catch (error) {
			// In strict mode, we rethrow errors
			if (strict) {
				throw error
			}
			// In non-strict mode, we skip failed logs
			continue
		}
	}

	return result
}

/**
 * Compare two arg values for equality.
 * Handles addresses (case-insensitive), bigints, and other primitives.
 */
function argsEqual(a: unknown, b: unknown): boolean {
	// Handle address comparison (case-insensitive)
	if (typeof a === 'string' && typeof b === 'string') {
		return a.toLowerCase() === b.toLowerCase()
	}
	// Handle bigint comparison
	if (typeof a === 'bigint' && typeof b === 'bigint') {
		return a === b
	}
	// Handle number comparison
	if (typeof a === 'number' && typeof b === 'number') {
		return a === b
	}
	// Default comparison
	return a === b
}
