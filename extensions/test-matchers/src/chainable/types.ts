import { type Assertion, chai } from 'vitest'

export type ChaiStatic = ReturnType<(typeof chai)['use']>
export type ChaiUtils = typeof chai.util
export type ChaiAssert = typeof chai.assert
export type ChaiContext<TAsync extends boolean = boolean, T = unknown> = Assertion<T> & {
	__flags: any
	__methods: any
	_obj: any
	assert: ChaiAssert
	then: TAsync extends true ? (onfulfilled: (value: T) => void, onrejected?: (reason: any) => void) => void : never
	catch: TAsync extends true ? (onrejected: (reason: any) => void) => void : never
}

export type MatcherResult<TState = unknown> = {
	pass: boolean
	message: () => string
	actual?: unknown
	expected?: unknown
	state?: TState
}

// Vitest-style matcher function (returns MatcherResult)
export type VitestMatcherFunction<TReceived = any, TAsync extends boolean = boolean, TState = unknown> = (
	received: TReceived,
	...args: any[]
) => TAsync extends true ? Promise<MatcherResult<TState>> : MatcherResult<TState>

// Chain state interface for tracking previous matcher results
export interface ChainState<TData = unknown, TState = unknown> {
	chainedFrom: string | undefined
	previousPassed: boolean | undefined
	previousValue: TData | undefined
	previousState: TState | undefined
	previousArgs: readonly unknown[] | undefined
}

// Extract function parameter types for VitestMatcherFunction (excluding received)
export type ExtractVitestArgs<T> = T extends (received: unknown, ...args: infer Args) => any ? Args : never

// Helper types for assertion return types
export type ChainableAssertion<T = unknown> = Promise<Assertion<T>> & Assertion<T>

export type IsAsync<T> = T extends (...args: any[]) => Promise<any> ? true : false

// Configuration for converting vitest matchers to chainable
export interface VitestMatcherConfig<
	TName extends string,
	TReceived = unknown,
	TAsync extends boolean = boolean,
	TState = unknown,
> {
	readonly name: TName
	readonly vitestMatcher: VitestMatcherFunction<TReceived, TAsync, TState>
}

// Properly inferred result type from VitestMatcherConfig
export interface InferredVitestChainableResult<TConfig extends VitestMatcherConfig<string, any, boolean, any>> {
	readonly name: TConfig['name']
	readonly isAsync: TConfig['vitestMatcher'] extends VitestMatcherFunction<any, infer TAsync, any> ? TAsync : false
	readonly methodFunction: (
		this: ChaiContext,
		...args: ExtractVitestArgs<TConfig['vitestMatcher']>
	) => TConfig['vitestMatcher'] extends VitestMatcherFunction<any, true, any> ? ChainableAssertion : Assertion
	readonly chainFunction: (this: ChaiContext) => Assertion
}
