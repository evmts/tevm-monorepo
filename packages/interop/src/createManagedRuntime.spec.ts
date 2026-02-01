import { describe, expect, it } from 'vitest'
import { Effect, Layer, Context, ManagedRuntime } from 'effect'
import { createManagedRuntime } from './createManagedRuntime.js'

describe('createManagedRuntime', () => {
	it('should create a managed runtime from a layer', async () => {
		// Define a service
		class CounterService extends Context.Tag('CounterService')<
			CounterService,
			{ getValue(): number }
		>() {}

		const CounterLive = Layer.succeed(CounterService, {
			getValue: () => 42,
		})

		const runtime = createManagedRuntime(CounterLive)

		const program = Effect.gen(function* () {
			const counter = yield* CounterService
			return counter.getValue()
		})

		const result = await runtime.runPromise(program)

		expect(result).toBe(42)

		// Clean up
		await runtime.dispose()
	})

	it('should support multiple services in a layer', async () => {
		class ServiceA extends Context.Tag('ServiceA')<ServiceA, { a(): string }>() {}
		class ServiceB extends Context.Tag('ServiceB')<ServiceB, { b(): string }>() {}

		const ServiceALive = Layer.succeed(ServiceA, { a: () => 'A' })
		const ServiceBLive = Layer.succeed(ServiceB, { b: () => 'B' })

		const CombinedLayer = Layer.merge(ServiceALive, ServiceBLive)

		const runtime = createManagedRuntime(CombinedLayer)

		const program = Effect.gen(function* () {
			const serviceA = yield* ServiceA
			const serviceB = yield* ServiceB
			return serviceA.a() + serviceB.b()
		})

		const result = await runtime.runPromise(program)

		expect(result).toBe('AB')

		await runtime.dispose()
	})

	it('should handle layer with state', async () => {
		let initCount = 0

		class StatefulService extends Context.Tag('StatefulService')<
			StatefulService,
			{ getInitCount(): number }
		>() {}

		const StatefulLive = Layer.effect(
			StatefulService,
			Effect.sync(() => {
				initCount++
				return {
					getInitCount: () => initCount,
				}
			})
		)

		const runtime = createManagedRuntime(StatefulLive)

		// Run multiple programs - should use same service instance
		const program = Effect.gen(function* () {
			const service = yield* StatefulService
			return service.getInitCount()
		})

		const result1 = await runtime.runPromise(program)
		const result2 = await runtime.runPromise(program)

		// Service should have been initialized once
		expect(result1).toBe(1)
		expect(result2).toBe(1)
		expect(initCount).toBe(1)

		await runtime.dispose()
	})

	it('should be usable for running effects', async () => {
		class SyncService extends Context.Tag('SyncService')<
			SyncService,
			{ compute(x: number): number }
		>() {}

		const SyncLive = Layer.succeed(SyncService, {
			compute: (x: number) => x * 2,
		})

		const runtime = createManagedRuntime(SyncLive)

		const program = Effect.gen(function* () {
			const service = yield* SyncService
			return service.compute(21)
		})

		const result = await runtime.runPromise(program)

		expect(result).toBe(42)

		await runtime.dispose()
	})

	it('should properly dispose resources', async () => {
		let disposed = false

		class DisposableService extends Context.Tag('DisposableService')<
			DisposableService,
			{ isActive(): boolean }
		>() {}

		const DisposableLive = Layer.scoped(
			DisposableService,
			Effect.acquireRelease(
				Effect.succeed({ isActive: () => true }),
				() =>
					Effect.sync(() => {
						disposed = true
					})
			)
		)

		const runtime = createManagedRuntime(DisposableLive)

		const program = Effect.gen(function* () {
			const service = yield* DisposableService
			return service.isActive()
		})

		const result = await runtime.runPromise(program)
		expect(result).toBe(true)
		expect(disposed).toBe(false)

		// Dispose the runtime
		await runtime.dispose()

		expect(disposed).toBe(true)
	})
})
