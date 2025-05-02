import { Effect, Schema } from 'effect'
import { Bytes } from 'ox'
import { getFunctionSelector } from 'viem'
import { fixedBytesFromBytes, fixedBytesFromHex } from './FixedBytes.js'
import type { FixedBytes } from './FixedBytes.js'

/**
 * 4-byte function selector
 */
export type Selector = FixedBytes<4>

/**
 * Schema for validating Selector values from Uint8Array
 */
export const Selector = fixedBytesFromBytes(4)

/**
 * Schema for validating Selector values from hex strings
 */
export const SelectorFromHex = fixedBytesFromHex(4)

/**
 * Converts Selector to a hexadecimal string.
 * @param selector - The Selector instance.
 */
export const toHex = (selector: Selector): Effect.Effect<string> => Effect.sync(() => Bytes.toHex(selector))

/**
 * Creates a Selector from a function signature (e.g., "transfer(address,uint256)")
 * @param signature - The function signature.
 */
export const fromSignature = (signature: string): Effect.Effect<Selector, Error> =>
	Effect.gen(function* (_) {
		const selectorHex = getFunctionSelector(signature)
		const bytes = Bytes.fromHex(selectorHex)
		return yield* _(Schema.decode(Selector)(bytes))
	})

/**
 * Creates a zero-filled Selector.
 */
export const zero = (): Effect.Effect<Selector, Error> =>
	Effect.gen(function* (_) {
		const bytes = new Uint8Array(4).fill(0)
		return yield* _(Schema.decode(Selector)(bytes))
	})

/**
 * Checks equality of two Selector instances.
 * @param a - First Selector instance.
 * @param b - Second Selector instance.
 */
export const isEqual = (a: Selector, b: Selector): Effect.Effect<boolean> => Effect.sync(() => Bytes.isEqual(a, b))
