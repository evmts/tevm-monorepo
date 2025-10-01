import { assert, type Assertion, chai, expect } from 'vitest'
import type {
	ChaiContext,
	ChaiStatic,
	ChaiUtils,
	ChainState,
	ChainableAssertion,
	ExtractVitestArgs,
	InferredVitestChainableResult,
	IsAsync,
	MatcherResult,
	VitestMatcherConfig,
	VitestMatcherFunction,
} from './types.js'

let chaiUtils: ChaiUtils | undefined
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

const isAsyncMatcher = <TReceived, TState>(
	matcher: VitestMatcherFunction<TReceived, boolean, TState>,
): matcher is VitestMatcherFunction<TReceived, true, TState> => {
	return matcher.constructor.name === 'AsyncFunction'
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

	// For async matchers, use the current object (which gets updated)
	// rather than the stored value (which might be a Promise)
	let previousValue = utils.flag(assertion, `${matcherName}.value`)
	const currentObj = utils.flag(assertion, 'object')
	// If the stored value is a Promise but current object is resolved, use current object
	if (previousValue && typeof previousValue.then === 'function' && currentObj !== previousValue)
		previousValue = currentObj

	const state = {
		chainedFrom: matcherName,
		previousPassed: utils.flag(assertion, `${matcherName}.passed`),
		previousValue,
		previousState: utils.flag(assertion, `${matcherName}.state`),
		previousArgs: utils.flag(assertion, `${matcherName}.args`),
	}

	return state
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
	utils.flag(assertion, `${name}.passed`, result.pass)
	utils.flag(assertion, `${name}.value`, obj)
	utils.flag(assertion, `${name}.state`, result.state)
	utils.flag(assertion, `${name}.args`, args)

	// Track chain history
	const chainHistory: string[] = utils.flag(assertion, 'chainHistory') ?? []
	chainHistory.push(name)
	utils.flag(assertion, 'chainHistory', chainHistory)
}

export const parseChainArgs = <TData = unknown, TState = unknown>(args: readonly unknown[]) => {
	const argsWithoutChainState = args.slice(0, -1)
	const chainState = args[args.length - 1]
	assert(
		chainState && typeof chainState === 'object' && 'chainedFrom' in chainState,
		'Internal error: no chain state found',
	)
	return { args: argsWithoutChainState, chainState: chainState as ChainState<TData, TState> }
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

	// Check if we're in an async chain
	const callPromise = chaiUtils.flag(this, 'callPromise')
	if (callPromise && typeof callPromise.then === 'function') {
		// We're chaining after an async matcher - join the promise chain
		return makeVitestAsyncChainable.call(this, name, vitestMatcher as VitestMatcherFunction, args)
	}

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

// Helper function to execute a promise-based matcher
const executeMatcherLogic = async <TName extends string, TArgs extends readonly unknown[], TReceived, TState>(
	context: ChaiContext<true>,
	name: TName,
	vitestMatcher: VitestMatcherFunction<TReceived, true, TState>,
	args: TArgs,
	actualObj: TReceived,
	isNegated: boolean,
	chaiUtils: ChaiUtils,
): Promise<TReceived> => {
	// Update object with the actual value for further chaining
	chaiUtils.flag(context, 'object', actualObj)

	// Build chain state AFTER we have the actual object
	const chainState = buildChainState(context, chaiUtils)

	// Store and restore negation flag properly
	const currentNegated = chaiUtils.flag(context, 'negate') === true
	chaiUtils.flag(context, 'negate', isNegated)

	const result = await (vitestMatcher(actualObj, ...args, chainState) as Promise<MatcherResult<TState>>)

	expectResult(result, isNegated)

	// Restore negation flag
	chaiUtils.flag(context, 'negate', currentNegated)

	// Store the results for future chained matchers
	storeChainState(context, chaiUtils, name, actualObj, args, result)

	return actualObj
}

// Updated async chainable function without duplication
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
	const isNegated = chaiUtils.flag(this, 'negate') === true

	// Get the current object (might be a Promise)
	const obj = chaiUtils.flag(this, 'object')

	const callPromiseValue = chaiUtils.flag(this, 'callPromise')

	// Handle both resolved and rejected promises
	const derivedPromise = callPromiseValue.then(
		// Success handler - for normal resolved promises
		async (resolvedValue: any) => {
			assert(chaiUtils !== undefined, 'ChaiUtils not initialized')
			const actualObj = resolvedValue !== undefined ? resolvedValue : await obj
			return await executeMatcherLogic(
				this,
				name,
				vitestMatcher as VitestMatcherFunction<TReceived, true, TState>,
				args,
				actualObj as TReceived,
				isNegated,
				chaiUtils,
			)
		},
		// Error handler - for rejected promises (like contract reverts)
		async (error: any) => {
			assert(chaiUtils !== undefined, 'ChaiUtils not initialized')

			// Wrap the error in a rejected promise so the matcher can catch and process it
			const errorPromise = Promise.reject(error)

			try {
				// Execute the matcher with the rejected promise
				// The matcher will catch the error, process it, and return the same rejected promise
				await executeMatcherLogic(
					this,
					name,
					vitestMatcher as VitestMatcherFunction<TReceived, true, TState>,
					args,
					errorPromise as TReceived,
					isNegated,
					chaiUtils,
				)

				// If matcher succeeds, convert the error from "rejected" to "resolved" for chaining
				// Next matcher will receive this through success handler but can access previous state
				return error
			} catch (executeError) {
				// The returned rejected promise throws when awaited - this is expected
				// Convert from rejected to resolved so the chain can continue
				if (executeError === error) return error
				// If it's a different error, the matcher actually failed - re-throw it
				throw executeError
			}
		},
	)

	// Make thenable (waffle-chai pattern)
	// biome-ignore lint/suspicious/noThenProperty: binding the promise to replicate chai waffle pattern
	this.then = derivedPromise.then.bind(derivedPromise)
	this.catch = derivedPromise.catch.bind(derivedPromise)
	chaiUtils.flag(this, 'callPromise', derivedPromise)

	return this as unknown as ChainableAssertion
}

// Convert existing vitest matcher to chainable with perfect type inference
export const createChainableFromVitest = <
	TName extends string,
	TReceived = any,
	TState = unknown,
	TMatcher extends VitestMatcherFunction<TReceived, boolean, TState> = VitestMatcherFunction<
		TReceived,
		boolean,
		TState
	>,
>(config: {
	name: TName
	vitestMatcher: TMatcher
}) => {
	const { name, vitestMatcher } = config
	const isAsync = isAsyncMatcher(vitestMatcher)

	return {
		name,
		isAsync,
		methodFunction: function (this: ChaiContext, ...args: ExtractVitestArgs<typeof vitestMatcher>) {
			if (isAsync) {
				return (makeVitestAsyncChainable<TName, ExtractVitestArgs<typeof vitestMatcher>, TReceived, true, TState>).call(
					this,
					name,
					vitestMatcher as VitestMatcherFunction<TReceived, true, TState>,
					args,
				)
			}
			return (makeVitestSyncChainable<TName, ExtractVitestArgs<typeof vitestMatcher>, TReceived, false, TState>).call(
				this as ChaiContext<false>,
				name,
				vitestMatcher as VitestMatcherFunction<TReceived, false, TState>,
				args as ExtractVitestArgs<typeof vitestMatcher>,
			)
		},
		chainFunction: function (this: ChaiContext): Assertion {
			assert(chaiUtils !== undefined, 'ChaiUtils not initialized')
			chaiUtils.flag(this, `${name}.chained`, true)
			return this
		},
	} as InferredVitestChainableResult<VitestMatcherConfig<TName, TReceived, IsAsync<TMatcher>, TState>>
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
