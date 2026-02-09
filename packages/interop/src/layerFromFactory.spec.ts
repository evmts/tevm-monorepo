import { Context, Effect, Layer } from 'effect'
import { describe, expect, it } from 'vitest'
import { layerFromFactory } from './layerFromFactory.js'

describe('layerFromFactory', () => {
	it('should create a Layer from a factory function', async () => {
		// Define a service interface
		interface DataService {
			getData(): Promise<string>
		}

		// Create the Context.Tag
		class DataServiceTag extends Context.Tag('DataService')<DataServiceTag, DataService>() {}

		// Factory function
		const createDataService = async (options: { prefix: string }): Promise<DataService> => ({
			getData: async () => `${options.prefix}-data`,
		})

		// Create Layer
		const DataServiceLive = layerFromFactory(DataServiceTag, createDataService)

		// Use the Layer
		const program = Effect.gen(function* () {
			const service = yield* DataServiceTag
			return yield* Effect.promise(() => service.getData())
		})

		const result = await Effect.runPromise(program.pipe(Effect.provide(DataServiceLive({ prefix: 'test' }))))

		expect(result).toBe('test-data')
	})

	it('should handle factory errors', async () => {
		interface FailingService {
			doSomething(): void
		}

		class FailingServiceTag extends Context.Tag('FailingService')<FailingServiceTag, FailingService>() {}

		const createFailingService = async (): Promise<FailingService> => {
			throw new Error('Factory failed')
		}

		const FailingServiceLive = layerFromFactory(FailingServiceTag, createFailingService)

		const program = Effect.gen(function* () {
			const service = yield* FailingServiceTag
			service.doSomething()
		})

		const result = await Effect.runPromise(Effect.either(program.pipe(Effect.provide(FailingServiceLive({})))))

		expect(result._tag).toBe('Left')
	})

	it('should work with complex options', async () => {
		interface ConfiguredService {
			getConfig(): { url: string; timeout: number }
		}

		class ConfiguredServiceTag extends Context.Tag('ConfiguredService')<ConfiguredServiceTag, ConfiguredService>() {}

		interface ServiceOptions {
			url: string
			timeout: number
			retries?: number
		}

		const createConfiguredService = async (options: ServiceOptions): Promise<ConfiguredService> => ({
			getConfig: () => ({ url: options.url, timeout: options.timeout }),
		})

		const ConfiguredServiceLive = layerFromFactory(ConfiguredServiceTag, createConfiguredService)

		const program = Effect.gen(function* () {
			const service = yield* ConfiguredServiceTag
			return service.getConfig()
		})

		const result = await Effect.runPromise(
			program.pipe(Effect.provide(ConfiguredServiceLive({ url: 'https://api.example.com', timeout: 5000 }))),
		)

		expect(result).toEqual({ url: 'https://api.example.com', timeout: 5000 })
	})

	it('should be composable with other layers', async () => {
		// First service
		interface LoggerService {
			log(msg: string): void
		}

		class LoggerServiceTag extends Context.Tag('LoggerService')<LoggerServiceTag, LoggerService>() {}

		const logs: string[] = []

		const LoggerLive = Layer.succeed(LoggerServiceTag, {
			log: (msg: string) => logs.push(msg),
		})

		// Second service that depends on logger
		interface AppService {
			run(): Promise<string>
		}

		class AppServiceTag extends Context.Tag('AppService')<AppServiceTag, AppService>() {}

		const createAppService = async (options: { name: string }): Promise<AppService> => ({
			run: async () => `App ${options.name} running`,
		})

		const AppServiceLive = layerFromFactory(AppServiceTag, createAppService)

		// Compose layers
		const program = Effect.gen(function* () {
			const logger = yield* LoggerServiceTag
			const app = yield* AppServiceTag
			logger.log('Starting app')
			const result = yield* Effect.promise(() => app.run())
			logger.log('App finished')
			return result
		})

		const fullLayer = Layer.merge(LoggerLive, AppServiceLive({ name: 'MyApp' }))

		const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))

		expect(result).toBe('App MyApp running')
		expect(logs).toEqual(['Starting app', 'App finished'])
	})
})
