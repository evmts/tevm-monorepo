import { describe, it, expect } from 'vitest'
import { Effect, Layer } from 'effect'
import { ForkConfigService } from './ForkConfigService.js'
import type { ForkConfigShape } from './types.js'

describe('ForkConfigService', () => {
	describe('Context.Tag', () => {
		it('should be a valid Context.Tag', () => {
			expect(ForkConfigService).toBeDefined()
			expect(ForkConfigService.key).toBe('ForkConfigService')
		})

		it('should be usable in Effect.gen for dependency injection', async () => {
			const mockConfig: ForkConfigShape = {
				chainId: 1n,
				blockTag: 18000000n,
			}

			const testLayer = Layer.succeed(ForkConfigService, mockConfig)

			const program = Effect.gen(function* () {
				const config = yield* ForkConfigService
				return config
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))
			expect(result).toBe(mockConfig)
		})

		it('should provide chainId as bigint', async () => {
			const mockConfig: ForkConfigShape = {
				chainId: 10n,
				blockTag: 123456789n,
			}

			const testLayer = Layer.succeed(ForkConfigService, mockConfig)

			const program = Effect.gen(function* () {
				const config = yield* ForkConfigService
				return config.chainId
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))
			expect(result).toBe(10n)
			expect(typeof result).toBe('bigint')
		})

		it('should provide blockTag as bigint', async () => {
			const mockConfig: ForkConfigShape = {
				chainId: 1n,
				blockTag: 999999999n,
			}

			const testLayer = Layer.succeed(ForkConfigService, mockConfig)

			const program = Effect.gen(function* () {
				const config = yield* ForkConfigService
				return config.blockTag
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(testLayer)))
			expect(result).toBe(999999999n)
			expect(typeof result).toBe('bigint')
		})
	})
})
