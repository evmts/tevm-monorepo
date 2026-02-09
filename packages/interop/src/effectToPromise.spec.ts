import { Context, Effect, Layer, ManagedRuntime } from 'effect'
import { describe, expect, it } from 'vitest'
import { effectToPromise } from './effectToPromise.js'

describe('effectToPromise', () => {
	describe('input validation', () => {
		it('should reject with TypeError when effect is null', async () => {
			await expect(effectToPromise(null as any)).rejects.toThrow(TypeError)
			await expect(effectToPromise(null as any)).rejects.toThrow(
				'effectToPromise: effect parameter is required and cannot be null or undefined',
			)
		})

		it('should reject with TypeError when effect is undefined', async () => {
			await expect(effectToPromise(undefined as any)).rejects.toThrow(TypeError)
			await expect(effectToPromise(undefined as any)).rejects.toThrow(
				'effectToPromise: effect parameter is required and cannot be null or undefined',
			)
		})
	})

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

	describe('Effects with requirements', () => {
		it('should work with custom runtime that satisfies requirements', async () => {
			// Define a service with requirements
			class ConfigService extends Context.Tag('ConfigService')<ConfigService, { apiUrl: string }>() {}

			// Create layer that provides the service
			const ConfigLive = Layer.succeed(ConfigService, { apiUrl: 'https://api.example.com' })

			// Effect that requires ConfigService
			const effect = Effect.gen(function* () {
				const config = yield* ConfigService
				return config.apiUrl
			})

			// Create a ManagedRuntime with the layer
			const managedRuntime = ManagedRuntime.make(ConfigLive)

			// Get the runtime and use it
			const runtime = await managedRuntime.runtime()
			const result = await effectToPromise(effect, runtime)

			expect(result).toBe('https://api.example.com')

			// Clean up
			await managedRuntime.dispose()
		})

		it('should fail at runtime when Effect has requirements but default runtime is used', async () => {
			// Define a service with requirements
			class MissingService extends Context.Tag('MissingService')<MissingService, { value: number }>() {}

			// Effect that requires MissingService
			const effect = Effect.gen(function* () {
				const service = yield* MissingService
				return service.value
			})

			// Using default runtime should fail since MissingService is not provided
			await expect(effectToPromise(effect)).rejects.toThrow()
		})

		it('should work when Effect requirements are satisfied with Effect.provide before conversion', async () => {
			// Define a service
			class CounterService extends Context.Tag('CounterService')<CounterService, { getCount: () => number }>() {}

			const CounterLive = Layer.succeed(CounterService, { getCount: () => 42 })

			// Effect with requirements
			const effectWithRequirements = Effect.gen(function* () {
				const counter = yield* CounterService
				return counter.getCount()
			})

			// Satisfy requirements with Effect.provide - R becomes never
			const satisfiedEffect = effectWithRequirements.pipe(Effect.provide(CounterLive))

			// Now can use default runtime since R is never
			const result = await effectToPromise(satisfiedEffect)

			expect(result).toBe(42)
		})

		it('should work with multiple services in custom runtime', async () => {
			// Define multiple services
			class ServiceA extends Context.Tag('ServiceA')<ServiceA, { valueA: string }>() {}
			class ServiceB extends Context.Tag('ServiceB')<ServiceB, { valueB: number }>() {}

			const ServiceALive = Layer.succeed(ServiceA, { valueA: 'hello' })
			const ServiceBLive = Layer.succeed(ServiceB, { valueB: 100 })

			// Combine layers
			const AllServices = Layer.mergeAll(ServiceALive, ServiceBLive)

			// Effect requiring both services
			const effect = Effect.gen(function* () {
				const a = yield* ServiceA
				const b = yield* ServiceB
				return `${a.valueA}-${b.valueB}`
			})

			// Create runtime with all services
			const managedRuntime = ManagedRuntime.make(AllServices)
			const runtime = await managedRuntime.runtime()

			const result = await effectToPromise(effect, runtime)

			expect(result).toBe('hello-100')

			await managedRuntime.dispose()
		})
	})
})
