import { describe, expect, it } from 'vitest'
import { Effect } from 'effect'
import { promiseToEffect } from './promiseToEffect.js'

describe('promiseToEffect', () => {
	it('should convert a Promise-returning function to Effect', async () => {
		const asyncFn = async (x: number) => x * 2

		const effectFn = promiseToEffect(asyncFn)
		const effect = effectFn(21)

		const result = await Effect.runPromise(effect)

		expect(result).toBe(42)
	})

	it('should handle Promise rejections as Effect failures', async () => {
		const asyncFn = async () => {
			throw new Error('Promise failed')
		}

		const effectFn = promiseToEffect(asyncFn)
		const effect = effectFn()

		const result = await Effect.runPromise(Effect.either(effect))

		expect(result._tag).toBe('Left')
	})

	it('should work with multiple arguments', async () => {
		const asyncFn = async (a: number, b: number, c: string) => `${a + b}-${c}`

		const effectFn = promiseToEffect(asyncFn)
		const effect = effectFn(1, 2, 'test')

		const result = await Effect.runPromise(effect)

		expect(result).toBe('3-test')
	})

	it('should work with no arguments', async () => {
		const asyncFn = async () => 'no args'

		const effectFn = promiseToEffect(asyncFn)
		const effect = effectFn()

		const result = await Effect.runPromise(effect)

		expect(result).toBe('no args')
	})

	it('should preserve async behavior', async () => {
		let sideEffect = false

		const asyncFn = async () => {
			await new Promise((resolve) => setTimeout(resolve, 10))
			sideEffect = true
			return 'done'
		}

		const effectFn = promiseToEffect(asyncFn)
		const effect = effectFn()

		expect(sideEffect).toBe(false)

		const result = await Effect.runPromise(effect)

		expect(result).toBe('done')
		expect(sideEffect).toBe(true)
	})

	it('should work with complex return types', async () => {
		interface ComplexType {
			data: { nested: string }
			values: number[]
		}

		const asyncFn = async (): Promise<ComplexType> => ({
			data: { nested: 'value' },
			values: [1, 2, 3],
		})

		const effectFn = promiseToEffect(asyncFn)
		const effect = effectFn()

		const result = await Effect.runPromise(effect)

		expect(result).toEqual({
			data: { nested: 'value' },
			values: [1, 2, 3],
		})
	})

	it('should be composable in Effect pipelines', async () => {
		const fetchData = async (id: string) => ({ id, value: 100 })
		const processData = async (data: { id: string; value: number }) => data.value * 2

		const fetchDataEffect = promiseToEffect(fetchData)
		const processDataEffect = promiseToEffect(processData)

		const program = Effect.gen(function* () {
			const data = yield* fetchDataEffect('test')
			const processed = yield* processDataEffect(data)
			return processed
		})

		const result = await Effect.runPromise(program)

		expect(result).toBe(200)
	})

	it('should fail when wrapping unbound class methods (demonstrates this binding issue)', async () => {
		// This test demonstrates the `this` binding gotcha documented in JSDoc
		class DataService {
			private value = 42
			async getValue() {
				return this.value
			}
		}

		const service = new DataService()

		// ❌ WRONG: Passing method reference without binding loses `this`
		const unboundEffect = promiseToEffect(service.getValue)
		const effect = unboundEffect()

		// Should fail because `this` is undefined
		const result = await Effect.runPromise(Effect.either(effect))

		expect(result._tag).toBe('Left')
		// Effect.tryPromise wraps the error in UnknownException
		// The underlying cause is a TypeError because this.value is accessed on undefined
		if (result._tag === 'Left') {
			// The error is wrapped by Effect.tryPromise, check it's an UnknownException
			expect(result.left).toHaveProperty('_tag', 'UnknownException')
		}
	})

	it('should work correctly when method is bound with .bind()', async () => {
		class DataService {
			private value = 42
			async getValue() {
				return this.value
			}
		}

		const service = new DataService()

		// ✅ CORRECT: Use .bind() to preserve `this` context
		const boundEffect = promiseToEffect(service.getValue.bind(service))
		const effect = boundEffect()

		const result = await Effect.runPromise(effect)

		expect(result).toBe(42)
	})

	it('should work correctly when using arrow function wrapper', async () => {
		class DataService {
			private value = 42
			async getValueById(id: string) {
				return { id, value: this.value }
			}
		}

		const service = new DataService()

		// ✅ ALSO CORRECT: Use arrow function to capture `this`
		const wrappedEffect = promiseToEffect((id: string) => service.getValueById(id))
		const effect = wrappedEffect('test-id')

		const result = await Effect.runPromise(effect)

		expect(result).toEqual({ id: 'test-id', value: 42 })
	})
})
