import { Effect, Exit, Layer } from 'effect'
import { describe, expect, it } from 'vitest'
import { StateManagerLive } from './StateManagerLive.js'
import { StateManagerService } from './StateManagerService.js'

describe('StateManagerLive', () => {
	describe('layer creation', () => {
		it('should create a layer that provides StateManagerService', () => {
			const layer = StateManagerLive()
			expect(layer).toBeDefined()
		})

		it('should require CommonService, TransportService, and ForkConfigService dependencies', async () => {
			const program = Effect.gen(function* () {
				const stateManager = yield* StateManagerService
				return stateManager
			})

			// Should fail without dependencies
			const layer = StateManagerLive()
			const exit = await Effect.runPromiseExit(
				program.pipe(Effect.provide(layer as unknown as Layer.Layer<StateManagerService>)),
			)
			expect(Exit.isFailure(exit)).toBe(true)
		})

		it('should accept StateManagerLiveOptions with loggingEnabled', () => {
			const layer = StateManagerLive({
				loggingEnabled: true,
			})
			expect(layer).toBeDefined()
		})

		it('should accept StateManagerLiveOptions with genesisStateRoot', () => {
			const layer = StateManagerLive({
				genesisStateRoot: new Uint8Array(32),
			})
			expect(layer).toBeDefined()
		})

		it('should accept empty StateManagerLiveOptions', () => {
			const layer = StateManagerLive({})
			expect(layer).toBeDefined()
		})
	})

	describe('exports', () => {
		it('should export StateManagerLive from the module', async () => {
			const { StateManagerLive: ExportedStateManagerLive } = await import('./StateManagerLive.js')
			expect(ExportedStateManagerLive).toBeDefined()
			expect(typeof ExportedStateManagerLive).toBe('function')
		})
	})
})
