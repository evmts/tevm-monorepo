import type { Assertion } from 'vitest'
import { describe, expectTypeOf, it } from 'vitest'
import { toBeAddress, toBeHex } from '../matchers/utils/index.js'
import { createChainableFromVitest } from './chainable.js'
import { type CustomMatchers, testMatchers } from './chainable.spec.js'
import type {
	ChainableAssertion,
	ChainState,
	InferredVitestChainableResult,
	MatcherResult,
	VitestMatcherConfig,
	VitestMatcherFunction,
} from './types.js'

// Import existing chainable matchers from spec
const {
	toBeBigIntChainable,
	toBeHexChainable,
	toBeAddressChainable,
	toPassDownStateChainable,
	toUsePreviousStateAndBigIntChainable,
	toResolveToStringChainable,
} = testMatchers

// Remove the separate asyncMatcher and asyncChainable - use the shared one

describe('chainable type system (exhaustive)', () => {
	it('type: basic configuration inference', () => {
		// Test real matcher config inference
		expectTypeOf<typeof toBeBigIntChainable>().toEqualTypeOf<
			InferredVitestChainableResult<VitestMatcherConfig<'toBeBigIntChainable', unknown, false, unknown>>
		>()

		expectTypeOf<typeof toBeHexChainable>().toEqualTypeOf<
			InferredVitestChainableResult<VitestMatcherConfig<'toBeHexChainable', unknown, false, unknown>>
		>()

		expectTypeOf<typeof toBeAddressChainable>().toEqualTypeOf<
			InferredVitestChainableResult<VitestMatcherConfig<'toBeAddressChainable', unknown, false, unknown>>
		>()

		expectTypeOf<typeof toResolveToStringChainable>().toExtend<
			InferredVitestChainableResult<
				VitestMatcherConfig<'toResolveToStringChainable', Promise<string>, true, { resolved: boolean }>
			>
		>()

		// Name should be inferred correctly
		expectTypeOf<typeof toBeBigIntChainable.name>().toEqualTypeOf<'toBeBigIntChainable'>()
		expectTypeOf<typeof toBeHexChainable.name>().toEqualTypeOf<'toBeHexChainable'>()
		expectTypeOf<typeof toBeAddressChainable.name>().toEqualTypeOf<'toBeAddressChainable'>()
		expectTypeOf<typeof toResolveToStringChainable.name>().toEqualTypeOf<'toResolveToStringChainable'>()
	})

	it('type: isAsync flag inference', () => {
		// Sync matchers should have isAsync: false
		expectTypeOf<typeof toBeBigIntChainable.isAsync>().toEqualTypeOf<false>()
		expectTypeOf<typeof toBeHexChainable.isAsync>().toEqualTypeOf<false>()
		expectTypeOf<typeof toBeAddressChainable.isAsync>().toEqualTypeOf<false>()

		// Async matcher should have isAsync: true
		expectTypeOf<typeof toResolveToStringChainable.isAsync>().toEqualTypeOf<true>()
	})

	it('type: method function parameter inference', () => {
		// Test that method functions exist and are functions
		expectTypeOf<typeof toBeBigIntChainable.methodFunction>().toBeFunction()
		expectTypeOf<typeof toBeHexChainable.methodFunction>().toBeFunction()
		expectTypeOf<typeof toPassDownStateChainable.methodFunction>().toBeFunction()
		expectTypeOf<typeof toResolveToStringChainable.methodFunction>().toBeFunction()
	})

	it('type: return type inference (sync vs async)', () => {
		// Sync matchers return Assertion
		expectTypeOf<ReturnType<typeof toBeBigIntChainable.methodFunction>>().toEqualTypeOf<Assertion>()
		expectTypeOf<ReturnType<typeof toBeHexChainable.methodFunction>>().toEqualTypeOf<Assertion>()
		expectTypeOf<ReturnType<typeof toPassDownStateChainable.methodFunction>>().toEqualTypeOf<Assertion>()

		// Async matchers return ChainableAssertion
		expectTypeOf<ReturnType<typeof toResolveToStringChainable.methodFunction>>().toExtend<ChainableAssertion>()
	})

	it('type: chain function consistency', () => {
		// All chain functions should have the same signature
		expectTypeOf<typeof toBeBigIntChainable.chainFunction>().toBeFunction()
		expectTypeOf<typeof toBeHexChainable.chainFunction>().toBeFunction()
		expectTypeOf<typeof toPassDownStateChainable.chainFunction>().toBeFunction()
		expectTypeOf<typeof toResolveToStringChainable.chainFunction>().toBeFunction()
	})

	it('type: vitest matcher function types', () => {
		// Test that vitest matcher types are properly structured
		expectTypeOf<VitestMatcherFunction<unknown, false, unknown>>().toBeFunction()
		expectTypeOf<VitestMatcherFunction<Promise<string>, true, { resolved: boolean }>>().toBeFunction()

		// Test specific return type structure
		expectTypeOf<MatcherResult<{ resolved: boolean }>>().toEqualTypeOf<{
			pass: boolean
			message: () => string
			actual?: unknown
			expected?: unknown
			state?: { resolved: boolean }
		}>()
	})

	it('type: chain state structure', () => {
		// Test ChainState type structure with real state types
		type TestState = { a: unknown; b: unknown; originalValue: unknown }

		expectTypeOf<ChainState<bigint, TestState>>().toEqualTypeOf<{
			chainedFrom: string | undefined
			previousPassed: boolean | undefined
			previousValue: bigint | undefined
			previousState: TestState | undefined
			previousArgs: readonly unknown[] | undefined
		}>()

		// Test that ChainState can be used with different types
		expectTypeOf<ChainState<string, { resolved: boolean }>>().toEqualTypeOf<{
			chainedFrom: string | undefined
			previousPassed: boolean | undefined
			previousValue: string | undefined
			previousState: { resolved: boolean } | undefined
			previousArgs: readonly unknown[] | undefined
		}>()
	})

	it('type: real world matcher inference', () => {
		// Test that real matchers are properly typed
		expectTypeOf<typeof toBeBigIntChainable>().toEqualTypeOf<
			InferredVitestChainableResult<VitestMatcherConfig<'toBeBigIntChainable', unknown, false, unknown>>
		>()

		expectTypeOf<typeof toBeHexChainable>().toEqualTypeOf<
			InferredVitestChainableResult<VitestMatcherConfig<'toBeHexChainable', unknown, false, unknown>>
		>()

		expectTypeOf<typeof toBeAddressChainable>().toEqualTypeOf<
			InferredVitestChainableResult<VitestMatcherConfig<'toBeAddressChainable', unknown, false, unknown>>
		>()

		expectTypeOf<typeof toResolveToStringChainable>().toExtend<
			InferredVitestChainableResult<
				VitestMatcherConfig<'toResolveToStringChainable', Promise<string>, true, { resolved: boolean }>
			>
		>()
	})

	it('type: state-aware matchers', () => {
		// Test state passing matchers from spec
		expectTypeOf<typeof toPassDownStateChainable>().toEqualTypeOf<
			InferredVitestChainableResult<VitestMatcherConfig<'toPassDownStateChainable', unknown, false, any>>
		>()

		expectTypeOf<typeof toUsePreviousStateAndBigIntChainable>().toEqualTypeOf<
			InferredVitestChainableResult<VitestMatcherConfig<'toUsePreviousStateAndBigIntChainable', unknown, false, any>>
		>()
	})

	it('type: utility types exist and work', () => {
		// Test that ChainState is properly generic and has the right properties
		expectTypeOf<ChainState<string, { resolved: boolean }>>().toHaveProperty('previousValue')
		expectTypeOf<ChainState<string, { resolved: boolean }>>().toHaveProperty('previousState')
		expectTypeOf<ChainState<string, { resolved: boolean }>>().toHaveProperty('chainedFrom')
	})

	it('type: custom matchers interface', () => {
		// Test that CustomMatchers interface is properly defined
		expectTypeOf<CustomMatchers>().toHaveProperty('toBeBigIntChainable')
		expectTypeOf<CustomMatchers>().toHaveProperty('toBeHexChainable')
		expectTypeOf<CustomMatchers>().toHaveProperty('toBeAddressChainable')
		expectTypeOf<CustomMatchers>().toHaveProperty('toPassDownStateChainable')
		expectTypeOf<CustomMatchers>().toHaveProperty('toUsePreviousStateAndBigIntChainable')
		expectTypeOf<CustomMatchers>().toHaveProperty('toResolveToStringChainable')
	})

	it('type: negative test cases (should not compile)', () => {
		// These test cases document what should NOT work

		// @ts-expect-error - cannot use wrong received type
		const wrongReceived: VitestMatcherFunction<number, false> = (_received: string) => ({
			pass: true,
			message: () => '',
		})

		// @ts-expect-error - cannot use wrong async flag
		const wrongAsync: VitestMatcherFunction<number, false> = async (_received: number) => ({
			pass: true,
			message: () => '',
		})

		// @ts-expect-error - async matcher must return Promise
		const asyncWithoutPromise: VitestMatcherFunction<number, true> = (_received: number) => ({
			pass: true,
			message: () => '',
		})

		// Suppress unused variable warnings
		void wrongReceived
		void wrongAsync
		void asyncWithoutPromise
	})

	it('type: conditional return types based on TAsync', () => {
		// Test that conditional types work correctly
		type SyncResult =
			VitestMatcherFunction<unknown, false, unknown> extends VitestMatcherFunction<any, true, any>
				? ChainableAssertion
				: Assertion
		type AsyncResult =
			VitestMatcherFunction<Promise<string>, true, { resolved: boolean }> extends VitestMatcherFunction<any, true, any>
				? ChainableAssertion
				: Assertion

		expectTypeOf<SyncResult>().toEqualTypeOf<Assertion>()
		expectTypeOf<AsyncResult>().toEqualTypeOf<ChainableAssertion>()
	})

	it('type: createChainableFromVitest function signature', () => {
		// Test that the creation function itself is properly typed
		expectTypeOf<typeof createChainableFromVitest>().toBeFunction()

		// Test that it can accept proper configs with real matchers
		expectTypeOf<VitestMatcherConfig<'toBeBigInt', unknown, false, unknown>>().toEqualTypeOf<{
			readonly name: 'toBeBigInt'
			readonly vitestMatcher: VitestMatcherFunction<unknown, false, unknown>
		}>()
	})

	it('type: real matcher functions from utils', () => {
		// Test that the original vitest matchers are properly typed
		expectTypeOf<typeof toBeHex>().toBeFunction()
		expectTypeOf<typeof toBeAddress>().toBeFunction()

		// Test that they can be used to create chainable matchers
		const testChainable = createChainableFromVitest({
			name: 'testMatcher' as const,
			vitestMatcher: toBeHex,
		})

		expectTypeOf<typeof testChainable>().toEqualTypeOf<
			InferredVitestChainableResult<VitestMatcherConfig<'testMatcher', unknown, false, unknown>>
		>()
	})
})
