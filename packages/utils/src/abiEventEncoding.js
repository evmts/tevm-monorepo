// @ts-check
/**
 * @fileoverview Native ABI event encoding/decoding functions using @tevm/voltaire
 * These functions replace viem's decodeEventLog and encodeEventTopics
 */

import * as AbiEvent from '@tevm/voltaire/Abi'
import * as Hex from '@tevm/voltaire/Hex'

/**
 * Decodes event log data and topics.
 * Native implementation using @tevm/voltaire that matches viem's decodeEventLog API.
 *
 * @template {import('viem').Abi} TAbi
 * @template {import('viem').ContractEventName<TAbi> | undefined} TEventName
 * @param {Object} options - Options object
 * @param {TAbi} options.abi - The contract ABI
 * @param {readonly (import('viem').Hex | null | undefined)[]} options.topics - The log topics
 * @param {import('viem').Hex} options.data - The log data
 * @param {TEventName} [options.eventName] - The event name to decode (optional, inferred from topic0 if not provided)
 * @param {boolean} [options.strict=true] - Whether to throw on errors or return undefined
 * @returns {Object} The decoded event log with eventName and args
 * @example
 * ```javascript
 * import { decodeEventLog } from '@tevm/utils'
 *
 * const { eventName, args } = decodeEventLog({
 *   abi: [{
 *     type: 'event',
 *     name: 'Transfer',
 *     inputs: [
 *       { type: 'address', name: 'from', indexed: true },
 *       { type: 'address', name: 'to', indexed: true },
 *       { type: 'uint256', name: 'value' }
 *     ]
 *   }],
 *   topics: [
 *     '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
 *     '0x0000000000000000000000000000000000000000000000000000000000000001',
 *     '0x0000000000000000000000000000000000000000000000000000000000000002'
 *   ],
 *   data: '0x00000000000000000000000000000000000000000000000000000000000003e8'
 * })
 * // eventName: 'Transfer'
 * // args: { from: '0x...001', to: '0x...002', value: 1000n }
 * ```
 */
export function decodeEventLog({ abi, topics, data, eventName, strict = true }) {
	try {
		// Filter null/undefined topics and convert to Uint8Array
		const bytesTopics = /** @type {Uint8Array[]} */ (
			topics
				.filter((t) => t != null)
				.map((t) => Hex.toBytes(/** @type {import('viem').Hex} */ (t)))
		)

		// Convert data to bytes
		const dataBytes = Hex.toBytes(data)

		// Find matching event(s) in ABI
		const events = /** @type {any[]} */ (abi).filter(
			(/** @type {any} */ item) => item.type === 'event',
		)

		if (events.length === 0) {
			if (strict) {
				throw new Error('No events found in ABI')
			}
			return undefined
		}

		// If eventName is provided, find that specific event
		let matchingEvent
		if (eventName) {
			matchingEvent = events.find((e) => e.name === eventName)
			if (!matchingEvent) {
				if (strict) {
					throw new Error(`Event "${eventName}" not found in ABI`)
				}
				return undefined
			}
		} else {
			// Try to match by topic0 (event selector)
			if (bytesTopics.length === 0) {
				if (strict) {
					throw new Error('No topics provided - cannot identify event')
				}
				return undefined
			}

			const topic0 = bytesTopics[0]
			if (!topic0) {
				if (strict) {
					throw new Error('Empty topic0 - cannot identify event')
				}
				return undefined
			}

			// Find event matching the selector
			for (const event of events) {
				if (event.anonymous) continue

				const selector = AbiEvent.Event.getSelector(event)
				const topic0Hex = Hex.fromBytes(topic0)
				const selectorHex = Hex.fromBytes(selector)

				if (topic0Hex === selectorHex) {
					matchingEvent = event
					break
				}
			}

			if (!matchingEvent) {
				if (strict) {
					throw new Error('No matching event found for topic0')
				}
				return undefined
			}
		}

		// Decode using voltaire
		const decoded = AbiEvent.Event.decodeLog(matchingEvent, dataBytes, bytesTopics)

		// Convert Uint8Array values back to hex strings for addresses and bytes
		const args = /** @type {Record<string, any>} */ ({})
		for (const input of matchingEvent.inputs) {
			if (!input.name) continue
			const value = decoded[input.name]
			if (value === undefined) continue

			// Convert Uint8Array to appropriate format based on type
			if (value instanceof Uint8Array) {
				if (input.type === 'address') {
					// Address should be a hex string
					args[input.name] = Hex.fromBytes(value.slice(-20))
				} else if (input.type.startsWith('bytes')) {
					// bytes/bytes32 should stay as Uint8Array or convert to hex
					args[input.name] = Hex.fromBytes(value)
				} else {
					args[input.name] = value
				}
			} else {
				args[input.name] = value
			}
		}

		return {
			eventName: matchingEvent.name,
			args,
		}
	} catch (error) {
		if (strict) {
			throw error
		}
		return undefined
	}
}

/**
 * Encodes event topics for filtering logs.
 * Native implementation using @tevm/voltaire that matches viem's encodeEventTopics API.
 *
 * @template {import('viem').Abi} TAbi
 * @template {import('viem').ContractEventName<TAbi>} TEventName
 * @param {Object} options - Options object
 * @param {TAbi} options.abi - The contract ABI
 * @param {TEventName} options.eventName - The event name to encode topics for
 * @param {Object} [options.args] - The indexed event arguments to encode
 * @returns {(import('viem').Hex | null)[]} The encoded topics array
 * @example
 * ```javascript
 * import { encodeEventTopics } from '@tevm/utils'
 *
 * const topics = encodeEventTopics({
 *   abi: [{
 *     type: 'event',
 *     name: 'Transfer',
 *     inputs: [
 *       { type: 'address', name: 'from', indexed: true },
 *       { type: 'address', name: 'to', indexed: true },
 *       { type: 'uint256', name: 'value' }
 *     ]
 *   }],
 *   eventName: 'Transfer',
 *   args: {
 *     from: '0x0000000000000000000000000000000000000001',
 *     to: '0x0000000000000000000000000000000000000002'
 *   }
 * })
 * // topics: ['0xddf252ad...', '0x...001', '0x...002']
 * ```
 */
export function encodeEventTopics({ abi, eventName, args }) {
	// Find the event in the ABI
	const event = /** @type {any[]} */ (abi).find(
		(/** @type {any} */ item) => item.type === 'event' && item.name === eventName,
	)

	if (!event) {
		throw new Error(`Event "${eventName}" not found in ABI`)
	}

	// Use voltaire's encodeTopics
	const bytesTopics = AbiEvent.Event.encodeTopics(event, args ?? {})

	// Convert Uint8Array topics to hex strings, keeping nulls as null
	return bytesTopics.map((topic) => {
		if (topic === null) return null
		return /** @type {import('viem').Hex} */ (Hex.fromBytes(topic))
	})
}
