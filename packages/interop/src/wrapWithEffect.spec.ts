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

	it('should NOT mutate the original object (immutability)', async () => {
		const original = {
			async getValue(): Promise<number> {
				return 42
			},
		}

		// Capture original state
		const originalHadEffect = 'effect' in original
		const originalKeys = Object.keys(original)

		const wrapped = wrapWithEffect(original, ['getValue'])

		// Verify original object was NOT mutated
		expect('effect' in original).toBe(originalHadEffect)
		expect(Object.keys(original)).toEqual(originalKeys)
		// @ts-expect-error - checking that effect doesn't exist on original
		expect(original.effect).toBeUndefined()

		// Verify wrapped object HAS the effect property
		expect(wrapped.effect).toBeDefined()
		expect(typeof wrapped.effect.getValue).toBe('function')

		// Verify wrapped and original are different objects
		expect(wrapped).not.toBe(original)

		// Verify the wrapped effect methods work correctly
		const result = await Effect.runPromise(wrapped.effect.getValue())
		expect(result).toBe(42)
	})

	it('should return a new object distinct from the original', () => {
		const original = {
			async method(): Promise<string> {
				return 'result'
			},
		}

		const wrapped = wrapWithEffect(original, ['method'])

		// These should be different object references
		expect(wrapped).not.toBe(original)

		// Modifying wrapped should not affect original
		;(wrapped as any).newProperty = 'test'
		expect((original as any).newProperty).toBeUndefined()
	})

	it('should preserve prototype chain for class instances', async () => {
		class BaseService {
			async baseMethod(): Promise<string> {
				return 'from base'
			}
		}

		class DerivedService extends BaseService {
			private state = 'initial'

			async derivedMethod(): Promise<string> {
				return `derived: ${this.state}`
			}

			async updateState(newState: string): Promise<void> {
				this.state = newState
			}
		}

		const service = new DerivedService()
		const wrapped = wrapWithEffect(service, ['derivedMethod', 'updateState'])

		// Prototype method from base class should still be accessible
		expect(typeof wrapped.baseMethod).toBe('function')
		const baseResult = await wrapped.baseMethod()
		expect(baseResult).toBe('from base')

		// Effect methods should work
		const effectResult = await Effect.runPromise(wrapped.effect.derivedMethod())
		expect(effectResult).toBe('derived: initial')

		// State should be shared properly
		await Effect.runPromise(wrapped.effect.updateState('updated'))
		const updatedResult = await Effect.runPromise(wrapped.effect.derivedMethod())
		expect(updatedResult).toBe('derived: updated')
	})

	it('should preserve getters and setters on wrapped object', async () => {
		const objWithAccessors = {
			_value: 10,
			get value() {
				return this._value * 2
			},
			set value(v: number) {
				this._value = v
			},
			async getValue(): Promise<number> {
				return this.value
			},
		}

		const wrapped = wrapWithEffect(objWithAccessors, ['getValue'])

		// Getter should work correctly on wrapped object (returns doubled value)
		expect(wrapped.value).toBe(20)

		// Setter should work correctly on wrapped object
		wrapped.value = 15
		expect(wrapped._value).toBe(15)
		expect(wrapped.value).toBe(30)

		// Effect methods use the ORIGINAL instance (not the wrapped copy)
		// This is intentional to preserve `this` binding to the original state.
		// So even though wrapped._value is 15, the effect method returns
		// the original instance's value (10 * 2 = 20)
		const result = await Effect.runPromise(wrapped.effect.getValue())
		expect(result).toBe(20)

		// Verify the original was NOT modified
		expect(objWithAccessors._value).toBe(10)
	})

	it('should preserve non-enumerable properties', async () => {
		const obj: { visible: string; hidden?: string; method: () => Promise<string> } = {
			visible: 'can see',
			async method(): Promise<string> {
				return this.hidden || 'no hidden'
			},
		}

		Object.defineProperty(obj, 'hidden', {
			value: 'secret',
			enumerable: false,
			writable: true,
			configurable: true,
		})

		const wrapped = wrapWithEffect(obj, ['method'])

		// Non-enumerable property should be preserved
		expect(wrapped.hidden).toBe('secret')
		expect(Object.keys(wrapped).includes('hidden')).toBe(false)

		// Method using non-enumerable property should work via Effect
		const result = await Effect.runPromise(wrapped.effect.method())
		expect(result).toBe('secret')
	})

	it('should preserve prototype methods defined on class', async () => {
		class DataStore {
			private data: Map<string, number> = new Map()

			async set(key: string, value: number): Promise<void> {
				this.data.set(key, value)
			}

			async get(key: string): Promise<number | undefined> {
				return this.data.get(key)
			}

			// This is a prototype method (not an own property of instances)
			size(): number {
				return this.data.size
			}
		}

		const store = new DataStore()
		const wrapped = wrapWithEffect(store, ['set', 'get'])

		// Use Effect API to set values
		await Effect.runPromise(wrapped.effect.set('a', 1))
		await Effect.runPromise(wrapped.effect.set('b', 2))

		// Prototype method should work
		expect(wrapped.size()).toBe(2)

		// Get via Effect should work
		const value = await Effect.runPromise(wrapped.effect.get('a'))
		expect(value).toBe(1)
	})

	it('should throw error if instance already has an effect property', () => {
		const objWithEffect = {
			effect: 'existing effect property',
			async method(): Promise<string> {
				return 'result'
			},
		}

		expect(() => wrapWithEffect(objWithEffect, ['method'])).toThrow(
			"Instance already has an 'effect' property",
		)
	})

	it('should throw descriptive error with guidance for effect property conflict', () => {
		const objWithEffect = {
			effect: { someData: true },
			async fetch(): Promise<void> {},
		}

		expect(() => wrapWithEffect(objWithEffect, ['fetch'])).toThrow(
			'Consider renaming the existing property or using a different wrapper approach',
		)
	})

	it('should handle synchronous exceptions as Effect failures (not defects)', async () => {
		// Issue #106: Verifies that synchronous exceptions thrown before returning
		// a Promise are properly caught and converted to Effect failures.
		const obj = {
			syncThrowingMethod(): Promise<string> {
				// This throws synchronously BEFORE returning a Promise
				throw new Error('Synchronous error')
			},
		}

		const wrapped = wrapWithEffect(obj, ['syncThrowingMethod'])

		const effect = wrapped.effect.syncThrowingMethod()
		const result = await Effect.runPromise(Effect.either(effect))

		// Should be a Left (failure), not a defect
		expect(result._tag).toBe('Left')
		if (result._tag === 'Left') {
			expect(result.left).toBeInstanceOf(Error)
			expect((result.left as Error).message).toBe('Synchronous error')
		}
	})

	it('should fail gracefully for synchronous methods that return non-Promises', async () => {
		// Edge case: synchronous methods that don't return Promises are NOT supported.
		// This documents the expected behavior - Effect.tryPromise requires a Promise.
		// TypeScript prevents this at compile-time, but this test documents runtime behavior.
		const obj = {
			syncMethod(): number {
				return 42
			},
		}

		// TypeScript would warn about this, but testing runtime behavior
		const wrapped = wrapWithEffect(obj, ['syncMethod' as keyof typeof obj])

		const effect = wrapped.effect.syncMethod()
		const result = await Effect.runPromise(Effect.either(effect))

		// Should fail because tryPromise expects a Promise, and 42 doesn't have a .then method
		expect(result._tag).toBe('Left')
		if (result._tag === 'Left') {
			expect(result.left).toBeInstanceOf(TypeError)
			expect((result.left as TypeError).message).toContain('is not a function')
		}
	})
})
