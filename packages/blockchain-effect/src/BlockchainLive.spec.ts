import { Effect, Exit, Layer } from 'effect'
import { describe, expect, it } from 'vitest'
import { BlockchainLive } from './BlockchainLive.js'
import { BlockchainService } from './BlockchainService.js'

describe('BlockchainLive', () => {
	describe('layer creation', () => {
		it('should create a layer that provides BlockchainService', () => {
			const layer = BlockchainLive()
			expect(layer).toBeDefined()
		})

		it('should require CommonService, TransportService, and ForkConfigService dependencies', async () => {
			const program = Effect.gen(function* () {
				const blockchain = yield* BlockchainService
				return blockchain
			})

			// Should fail without dependencies
			const layer = BlockchainLive()
			const exit = await Effect.runPromiseExit(
				program.pipe(Effect.provide(layer as unknown as Layer.Layer<BlockchainService>)),
			)
			expect(Exit.isFailure(exit)).toBe(true)
		})

		it('should accept BlockchainLiveOptions with genesisStateRoot', () => {
			const layer = BlockchainLive({
				genesisStateRoot: new Uint8Array(32),
			})
			expect(layer).toBeDefined()
		})

		it('should accept BlockchainLiveOptions with genesisBlock', () => {
			const layer = BlockchainLive({
				genesisBlock: undefined, // placeholder for actual block
			})
			expect(layer).toBeDefined()
		})

		it('should accept empty BlockchainLiveOptions', () => {
			const layer = BlockchainLive({})
			expect(layer).toBeDefined()
		})
	})

	describe('exports', () => {
		it('should export BlockchainLive from the module', async () => {
			const { BlockchainLive: ExportedBlockchainLive } = await import('./BlockchainLive.js')
			expect(ExportedBlockchainLive).toBeDefined()
			expect(typeof ExportedBlockchainLive).toBe('function')
		})
	})
})
