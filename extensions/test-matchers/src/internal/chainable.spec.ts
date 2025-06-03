import { assert, describe, expect, it } from 'vitest'
import { toBeAddress, toBeBigInt, toBeHex } from '../matchers/utils/index.js'
import { createChainableFromVitest, registerChainableMatchers } from './chainable.js'
import type { ChainState } from './types.js'

/* ---------------------------------- TYPES --------------------------------- */
export interface CustomMatchers {
	/**
	 * Assert that a value is a BigInt
	 */
	toBeBigIntChainable(): this

	/**
	 * Assert that a value is a hex string
	 */
	toBeHexChainable(): this

	/**
	 * Assert that a value is an address
	 */
	toBeAddressChainable(): this

	/**
	 * Assert and return state
	 */
	toPassDownStateChainable(a: unknown, b: unknown): this

	/**
	 * Assert that previous state was passed correctly
	 */
	toUsePreviousStateAndBigIntChainable(): this
}

// Augment vitest's Assertion - this preserves ALL existing functionality including 'not'
declare module 'vitest' {
	interface Assertion<T = any> extends CustomMatchers {}
}

/* ----------------------------- VITEST MATCHERS ---------------------------- */
type ToPassDownStateState = {
	a: unknown
	b: unknown
	originalValue: unknown
}

// State-aware vitest matcher for testing
function toPassDownState(received: unknown, a: unknown, b: unknown) {
	const pass = true
	return {
		pass,
		actual: received,
		expected: 'anything',
		message: () => '',
		state: { a, b, originalValue: received } satisfies ToPassDownStateState,
	}
}

// Chained matcher that uses previous state - simplified ChainState signature
function toUsePreviousStateAndBigInt(received: unknown, chainState?: ChainState<unknown, ToPassDownStateState>) {
	const { previousState, previousArgs } = chainState ?? {}
	// We want the state to be preserved regardless of pass or not (it should pass even with a not. modifier)
	assert(
		received !== undefined &&
			previousState?.a !== undefined &&
			previousState.b !== undefined &&
			previousArgs !== undefined &&
			received === previousState?.originalValue,
		'State was not correctly preserved',
	)
	const pass = typeof received === 'bigint'
	return {
		pass,
		actual: received,
		expected: pass ? 'a bigint' : 'not a bigint',
		message: () =>
			pass
				? "State and args properly passed but didn't receive a bigint"
				: 'State and args properly passed but received a bigint',
	}
}

/* ----------------------------- CHAINABLE MATCHERS ---------------------------- */
// Convert existing util matchers to chainable
const toBeBigIntChainable = createChainableFromVitest({
	name: 'toBeBigIntChainable' as const,
	vitestMatcher: toBeBigInt,
})

const toBeHexChainable = createChainableFromVitest({
	name: 'toBeHexChainable' as const,
	vitestMatcher: toBeHex,
})

const toBeAddressChainable = createChainableFromVitest({
	name: 'toBeAddressChainable' as const,
	vitestMatcher: toBeAddress,
})

// State-testing matchers - no more chainFrom needed
const toPassDownStateChainable = createChainableFromVitest({
	name: 'toPassDownStateChainable' as const,
	vitestMatcher: toPassDownState,
})

const toUsePreviousStateAndBigIntChainable = createChainableFromVitest({
	name: 'toUsePreviousStateAndBigIntChainable' as const,
	vitestMatcher: toUsePreviousStateAndBigInt,
})

// Register all test matchers
export const testMatchers = {
	toBeBigIntChainable,
	toBeHexChainable,
	toBeAddressChainable,
	toPassDownStateChainable,
	toUsePreviousStateAndBigIntChainable,
}

registerChainableMatchers(testMatchers)

/* ----------------------------- TESTING ----------------------------- */
describe('chainable matchers', () => {
	it('work standalone', () => {
		expect(123n).toBeBigIntChainable()
		expect('0x123').toBeHexChainable()
		expect('0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC').toBeAddressChainable()
	})

	it('chaining and negation work seamlessly', () => {
		// Chain multiple matchers
		expect('0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC').toBeHexChainable().toBeAddressChainable()

		// Use 'not' with chaining
		expect('0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC').toBeAddressChainable().not.toBeBigIntChainable()
		expect('0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC')
			.not.toBeBigIntChainable()
			// negation gets reset after each chainable call
			.toBeAddressChainable()
			.toBeHexChainable()
		expect('not a bigint').not.toBeBigIntChainable().not.toBeHexChainable()
	})

	it('state passing between vitest matchers', () => {
		expect(5n)
			.toPassDownStateChainable(1n, 2n)
			.toUsePreviousStateAndBigIntChainable()
			.toBeBigIntChainable()
			.not.toBeHexChainable()
		expect(5).toPassDownStateChainable(1n, 2n).not.toUsePreviousStateAndBigIntChainable()
	})

	it('error handling', () => {
		expect(() => expect(5).toBeBigIntChainable()).toThrow('Expected 5 to be a BigInt')
		expect(() => expect(5n).not.toBeBigIntChainable()).toThrow('Expected 5 not to be a BigInt')
		expect(() => expect('0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC').toBeHexChainable().toBeBigIntChainable()).toThrow(
			'Expected 0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC to be a BigInt',
		)
		expect(() => expect('invalid address').not.toBeBigIntChainable().toBeAddressChainable()).toThrow(
			'Expected invalid address to be a valid Ethereum address (checksummed)',
		)
		expect(() =>
			expect(5n).toPassDownStateChainable(1n, 2n).toUsePreviousStateAndBigIntChainable().not.toBeBigIntChainable(),
		).toThrow('Expected 5 not to be a BigInt')
	})
})
