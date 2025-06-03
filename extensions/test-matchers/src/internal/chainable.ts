import { assert, type Assertion, chai, expect } from 'vitest'
import type {
	ChaiContext,
	ChaiStatic,
	ChaiUtils,
	ChainState,
	ChainableAssertion,
	ExtractVitestArgs,
	InferredVitestChainableResult,
	MatcherResult,
	VitestMatcherConfig,
	VitestMatcherFunction,
} from './types.js'

let chaiUtils: ChaiUtils | undefined = undefined
export const getChaiUtils = () => chaiUtils

// Promise setup helper (waffle-chai pattern)
const setupPromise = (assertion: Assertion, utils: ChaiUtils): void => {
	const existingPromise = utils.flag(assertion, 'callPromise')
	if (existingPromise) return

	const obj = utils.flag(assertion, 'object')
	if (obj && typeof obj.then === 'function') {
		utils.flag(assertion, 'callPromise', obj)
	} else {
		utils.flag(assertion, 'callPromise', Promise.resolve())
	}
}

const isAsyncFunction = <T extends Function>(fn: T): fn is T & { constructor: { name: 'AsyncFunction' } } => {
	return fn.constructor.name === 'AsyncFunction'
}

// Build chain state from flags - automatically detect any previous matcher
const buildChainState = (assertion: Assertion, utils: ChaiUtils): ChainState => {
	// Get the chain history from a dedicated flag
	const chainHistory: string[] = utils.flag(assertion, 'chainHistory') || []

	if (chainHistory.length === 0) {
		return {
			chainedFrom: undefined,
			previousPassed: undefined,
			previousValue: undefined,
			previousState: undefined,
			previousArgs: undefined,
		}
	}

	// Use the most recent chained matcher
	const matcherName = chainHistory[chainHistory.length - 1]

	return {
		chainedFrom: matcherName,
		previousPassed: utils.flag(assertion, `${matcherName}.passed`),
		previousValue: utils.flag(assertion, `${matcherName}.value`),
		previousState: utils.flag(assertion, `${matcherName}.state`),
		previousArgs: utils.flag(assertion, `${matcherName}.args`),
	}
}

// Used to fail an assertion in chai with vitest highlighting and trace
const createInternalResultHandler = () => {
	return {
		__expectResult: function (this: any, result: MatcherResult, isNegated: boolean) {
			assert(chaiUtils !== undefined, 'ChaiUtils not initialized')
			const shouldFail = isNegated ? result.pass : !result.pass

			if (shouldFail) {
				return {
					pass: false,
					message: () => result.message(),
					actual: result.actual,
					expected: result.expected,
				}
			}

			return { pass: true, message: () => result.message() }
		},
	}
}

const expectResult = (result: MatcherResult, isNegated: boolean) => {
	;(
		expect(result) as unknown as {
			__expectResult: (isNegated: boolean) => MatcherResult
		}
	).__expectResult(isNegated)
}

// Only extract truly common parts
const storeChainState = <TName extends string, TAsync extends boolean = false>(
	assertion: ChaiContext<TAsync>,
	utils: ChaiUtils,
	name: TName,
	obj: unknown,
	args: readonly unknown[],
	result: MatcherResult,
) => {
	utils.flag(assertion, `${name}.passed`, true)
	utils.flag(assertion, `${name}.value`, obj)
	utils.flag(assertion, `${name}.state`, result.state)
	utils.flag(assertion, `${name}.args`, args)

	// Track chain history
	const chainHistory: string[] = utils.flag(assertion, 'chainHistory') || []
	chainHistory.push(name)
	utils.flag(assertion, 'chainHistory', chainHistory)
}

// Vitest matcher wrapper for sync matchers
function makeVitestSyncChainable<
	TName extends string,
	TArgs extends readonly unknown[],
	TReceived,
	TAsync extends boolean,
	TState,
>(
	this: ChaiContext<false>,
	name: TName,
	vitestMatcher: VitestMatcherFunction<TReceived, TAsync, TState>,
	args: TArgs,
): Assertion {
	assert(chaiUtils !== undefined, 'ChaiUtils not initialized')

	const obj = chaiUtils.flag(this, 'object')
	const chainState = buildChainState(this, chaiUtils)

	// Capture and reset negation flag (sync pattern)
	const isNegated = chaiUtils.flag(this, 'negate') === true
	chaiUtils.flag(this, 'negate', false)

	const result = vitestMatcher(obj as TReceived, ...args, chainState) as MatcherResult<TState>
	expectResult(result, isNegated)

	storeChainState(this, chaiUtils, name, obj, args, result)
	return this
}

// Vitest matcher wrapper for async matchers
function makeVitestAsyncChainable<
	TName extends string,
	TArgs extends readonly unknown[],
	TReceived,
	TAsync extends boolean,
	TState,
>(
	this: ChaiContext<true>,
	name: TName,
	vitestMatcher: VitestMatcherFunction<TReceived, TAsync, TState>,
	args: TArgs,
): ChainableAssertion {
	assert(chaiUtils !== undefined, 'ChaiUtils not initialized')

	setupPromise(this, chaiUtils)
	// Store negation flag consistently using chaiUtils (async pattern - BEFORE promise)
	const isNegated = chaiUtils.flag(this, 'negate') === true

	const callPromiseValue = chaiUtils.flag(this, 'callPromise')
	const derivedPromise = callPromiseValue.then(async () => {
		assert(chaiUtils !== undefined, 'ChaiUtils not initialized')
		const obj = chaiUtils.flag(this, 'object')
		const actualObj = await obj

		// Update object with resolved value for further chaining
		chaiUtils.flag(this, 'object', actualObj)

		// Store and restore negation flag properly (async pattern)
		const currentNegated = chaiUtils.flag(this, 'negate') === true
		chaiUtils.flag(this, 'negate', isNegated)

		const chainState = buildChainState(this, chaiUtils)
		const result = await (vitestMatcher(actualObj as TReceived, ...args, chainState) as Promise<MatcherResult<TState>>)
		expectResult(result, isNegated)

		// Restore negation flag
		chaiUtils.flag(this, 'negate', currentNegated)

		storeChainState(this, chaiUtils, name, actualObj, args, result)
	})

	// Make thenable (waffle-chai pattern)
	this.then = derivedPromise.then.bind(derivedPromise)
	this.catch = derivedPromise.catch.bind(derivedPromise)
	chaiUtils.flag(this, 'callPromise', derivedPromise)

	return this as unknown as ChainableAssertion
}

// Convert existing vitest matcher to chainable with perfect type inference
export const createChainableFromVitest = <
	TName extends string,
	TReceived = unknown,
	TAsync extends boolean = false,
	TState = unknown,
>(
	config: VitestMatcherConfig<TName, TReceived, TAsync, TState>,
) => {
	const { name, vitestMatcher } = config
	const actualIsAsync = isAsyncFunction(vitestMatcher) as TAsync

	return {
		name,
		isAsync: actualIsAsync,

		// Method function (when called as .method())
		methodFunction: function (this: ChaiContext, ...args: ExtractVitestArgs<typeof vitestMatcher>) {
			if (actualIsAsync) {
				const asyncWrapper = makeVitestAsyncChainable<TName, typeof args, TReceived, TAsync, TState>
				return asyncWrapper.call(this, name, vitestMatcher, args)
			}
			const syncWrapper = makeVitestSyncChainable<TName, typeof args, TReceived, TAsync, TState>
			return syncWrapper.call(this, name, vitestMatcher, args)
		},

		// Chain function (when accessed as .method.something) - REMOVE chain tracking
		chainFunction: function (this: ChaiContext): Assertion {
			assert(chaiUtils !== undefined, 'ChaiUtils not initialized')
			chaiUtils.flag(this, `${name}.chained`, true)
			return this
		},
	} as InferredVitestChainableResult<typeof config>
}

// Plugin creator with context-aware registration
export const createChainablePlugin = (
	matchers: Record<string, InferredVitestChainableResult<VitestMatcherConfig<string, any, boolean, any>>>,
) => {
	return (_chai: ChaiStatic, utils: ChaiUtils) => {
		// Store utils reference
		chaiUtils = utils

		Object.entries(matchers).forEach(([_, matcher]) => {
			utils.addChainableMethod(_chai.Assertion.prototype, matcher.name, matcher.methodFunction, matcher.chainFunction)
		})
	}
}

// Convenience function to register chainable matchers
export const registerChainableMatchers = (
	matchers: Record<string, InferredVitestChainableResult<VitestMatcherConfig<string, any, boolean, any>>>,
): void => {
	expect.extend(createInternalResultHandler())
	chai.use(createChainablePlugin(matchers))
}
