import { describe, expect, it } from 'vitest'
import { Effect } from 'effect'
import { wrapWithEffect } from './wrapWithEffect.js'

describe('wrapWithEffect', () => {
	it('should add effect methods to an object', async () => {
		const obj = {
			async getValue(): Promise<number> {
				return 42
			},
			async setValue(x: number): Promise<void> {
				// side effect
			},
		}

		const wrapped = wrapWithEffect(obj, ['getValue', 'setValue'])

		expect(wrapped.effect).toBeDefined()
		expect(typeof wrapped.effect.getValue).toBe('function')
		expect(typeof wrapped.effect.setValue).toBe('function')
	})

	it('should preserve original methods', async () => {
		const obj = {
			async getValue(): Promise<number> {
				return 42
			},
		}

		const wrapped = wrapWithEffect(obj, ['getValue'])

		// Original method still works
		const result = await wrapped.getValue()
		expect(result).toBe(42)
	})

	it('should make effect methods that return Effects', async () => {
		const obj = {
			async getData(id: string): Promise<{ id: string; value: number }> {
				return { id, value: 100 }
			},
		}

		const wrapped = wrapWithEffect(obj, ['getData'])

		const effect = wrapped.effect.getData('test-id')
		const result = await Effect.runPromise(effect)

		expect(result).toEqual({ id: 'test-id', value: 100 })
	})

	it('should handle multiple methods', async () => {
		const obj = {
			async methodA(): Promise<string> {
				return 'A'
			},
			async methodB(): Promise<string> {
				return 'B'
			},
			async methodC(): Promise<string> {
				return 'C'
			},
		}

		const wrapped = wrapWithEffect(obj, ['methodA', 'methodB', 'methodC'])

		const program = Effect.gen(function* () {
			const a = yield* wrapped.effect.methodA()
			const b = yield* wrapped.effect.methodB()
			const c = yield* wrapped.effect.methodC()
			return a + b + c
		})

		const result = await Effect.runPromise(program)
		expect(result).toBe('ABC')
	})

	it('should handle method errors as Effect failures', async () => {
		const obj = {
			async failingMethod(): Promise<never> {
				throw new Error('Method failed')
			},
		}

		const wrapped = wrapWithEffect(obj, ['failingMethod'])

		const effect = wrapped.effect.failingMethod()
		const result = await Effect.runPromise(Effect.either(effect))

		expect(result._tag).toBe('Left')
	})

	it('should only wrap specified methods', () => {
		const obj = {
			async methodA(): Promise<string> {
				return 'A'
			},
			async methodB(): Promise<string> {
				return 'B'
			},
		}

		const wrapped = wrapWithEffect(obj, ['methodA'])

		expect(wrapped.effect.methodA).toBeDefined()
		expect(wrapped.effect.methodB).toBeUndefined()
	})

	it('should throw error for non-function properties', () => {
		const obj = {
			value: 42,
			async method(): Promise<string> {
				return 'result'
			},
		}

		// TypeScript would normally prevent this, but testing runtime behavior
		expect(() => wrapWithEffect(obj, ['value' as keyof typeof obj, 'method'])).toThrow(
			"Property 'value' is not a function",
		)
	})

	it('should throw error for missing methods', () => {
		const obj = {
			async method(): Promise<string> {
				return 'result'
			},
		}

		// TypeScript would normally prevent this, but testing runtime behavior
		expect(() => wrapWithEffect(obj, ['nonexistent' as keyof typeof obj])).toThrow(
			"Method 'nonexistent' does not exist on instance",
		)
	})

	it('should preserve this binding for methods', async () => {
		class Counter {
			private count = 0

			async increment(): Promise<number> {
				this.count++
				return this.count
			}

			async getCount(): Promise<number> {
				return this.count
			}
		}

		const counter = new Counter()
		const wrapped = wrapWithEffect(counter, ['increment', 'getCount'])

		const program = Effect.gen(function* () {
			yield* wrapped.effect.increment()
			yield* wrapped.effect.increment()
			return yield* wrapped.effect.getCount()
		})

		const result = await Effect.runPromise(program)
		expect(result).toBe(2)
	})
})
