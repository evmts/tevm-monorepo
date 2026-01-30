import { describe, expect, it } from 'vitest'
import { Effect, Runtime, Layer, Context, ManagedRuntime } from 'effect'
import { effectToPromise } from './effectToPromise.js'

describe('effectToPromise', () => {
	it('should convert a successful Effect to a resolved Promise', async () => {
		const effect = Effect.succeed(42)

		const result = await effectToPromise(effect)

		expect(result).toBe(42)
	})

	it('should convert a failed Effect to a rejected Promise', async () => {
		const effect = Effect.fail(new Error('Test error'))

		await expect(effectToPromise(effect)).rejects.toThrow('Test error')
	})

	it('should work with complex Effect pipelines', async () => {
		const effect = Effect.gen(function* () {
			const a = yield* Effect.succeed(10)
			const b = yield* Effect.succeed(20)
			return a + b
		})

		const result = await effectToPromise(effect)

		expect(result).toBe(30)
	})

	it('should work with async Effects', async () => {
		const effect = Effect.promise(async () => {
			await new Promise((resolve) => setTimeout(resolve, 10))
			return 'async result'
		})

		const result = await effectToPromise(effect)

		expect(result).toBe('async result')
	})

	it('should work with Effect.provide for services', async () => {
		// Create a simple layer
		class TestService extends Context.Tag('TestService')<TestService, { value: number }>() {}

		const TestLive = Layer.succeed(TestService, { value: 100 })

		const effect = Effect.gen(function* () {
			const service = yield* TestService
			return service.value
		}).pipe(Effect.provide(TestLive))

		const result = await effectToPromise(effect)

		expect(result).toBe(100)
	})

	it('should reject with error when Effect fails', async () => {
		const effect = Effect.fail(new Error('Custom error'))

		await expect(effectToPromise(effect)).rejects.toThrow('Custom error')
	})
})
