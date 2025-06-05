import { assert, describe, expect, it } from 'vitest'
import { toBeAddress, toBeHex } from '../matchers/utils/index.js'
import { createChainableFromVitest, registerChainableMatchers } from './chainable.js'
import type { ChainState, ChainableAssertion } from './types.js'

/* ---------------------------------- TYPES --------------------------------- */
export interface CustomMatchers {
	/**
	 * Assert that a value is a bigint
	 */
	toBeBigIntChainable(): ChainableAssertion

	/**
	 * Assert that a value is a hex string
	 */
	toBeHexChainable(): ChainableAssertion

	/**
	 * Assert that a value is an address
	 */
	toBeAddressChainable(): ChainableAssertion

	/**
	 * Assert and return state
	 */
	toPassDownStateChainable(a: unknown, b: unknown): ChainableAssertion

	/**
	 * Assert that previous state was passed correctly
	 */
	toUsePreviousStateAndBigIntChainable(): ChainableAssertion

	/**
	 * Assert that a promise resolves to a string (async)
	 */
	toResolveToStringChainable(): ChainableAssertion
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
const toPassDownState = (received: unknown, a: unknown, b: unknown) => {
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
const toUsePreviousStateAndBigInt = (received: unknown, chainState?: ChainState<unknown, ToPassDownStateState>) => {
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

// Add this async vitest matcher
const toResolveToString = async (received: Promise<unknown>) => {
	try {
		const resolved = await received
		const pass = typeof resolved === 'string'
		return {
			pass,
			actual: resolved,
			expected: 'a string',
			message: () =>
				pass
					? `Expected promise not to resolve to a string but got: ${resolved}`
					: `Expected promise to resolve to a string but got: ${typeof resolved}`,
			state: { resolved, wasAsync: true },
		}
	} catch (error) {
		return {
			pass: false,
			actual: error,
			expected: 'a resolved promise',
			message: () => `Expected promise to resolve but it rejected with: ${error}`,
		}
	}
}

/* ----------------------------- CHAINABLE MATCHERS ---------------------------- */
// Create a vitest matcher and convert it inline
const toBeBigIntChainable = createChainableFromVitest({
	name: 'toBeBigIntChainable' as const,
	vitestMatcher: (received: unknown) => {
		const pass = typeof received === 'bigint'
		return {
			pass,
			actual: received,
			expected: 'a bigint',
			message: () => (pass ? `Expected ${received} not to be a BigInt` : `Expected ${received} to be a BigInt`),
		}
	},
})

// Convert existing util matchers to chainable
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

// Create the async chainable matcher
const toResolveToStringChainable = createChainableFromVitest({
	name: 'toResolveToStringChainable' as const,
	vitestMatcher: toResolveToString,
})

// Register all test matchers
export const testMatchers = {
	toBeBigIntChainable,
	toBeHexChainable,
	toBeAddressChainable,
	toPassDownStateChainable,
	toUsePreviousStateAndBigIntChainable,
	toResolveToStringChainable,
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

	it('async matchers work correctly', async () => {
		// Test async matcher standalone
		await expect(Promise.resolve('hello')).toResolveToStringChainable()

		// Test async with negation
		await expect(Promise.resolve(123)).not.toResolveToStringChainable()

		// Test async with chaining
		await expect(Promise.resolve('0x123')).toResolveToStringChainable().toBeHexChainable()
	})

	it('async error handling', async () => {
		await expect(() => expect(Promise.resolve(123)).toResolveToStringChainable()).rejects.toThrow(
			'Expected promise to resolve to a string but got: number',
		)

		await expect(() => expect(Promise.resolve('hello')).not.toResolveToStringChainable()).rejects.toThrow(
			'Expected promise not to resolve to a string but got: hello',
		)

		await expect(() =>
			expect(Promise.resolve('hello')).toResolveToStringChainable().toBeHexChainable(),
		).rejects.toThrow('Expected hello to start with "0x"')
	})
})
