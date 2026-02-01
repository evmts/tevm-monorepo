import { describe, it, expect } from 'vitest'
import { Effect } from 'effect'
import { ForkConfigStatic } from './ForkConfigStatic.js'
import { ForkConfigService } from './ForkConfigService.js'

describe('ForkConfigStatic', () => {
	describe('Layer creation', () => {
		it('should create a valid Layer', () => {
			const layer = ForkConfigStatic({
				chainId: 1n,
				blockTag: 18000000n,
			})
			expect(layer).toBeDefined()
		})

		it('should provide ForkConfigService', async () => {
			const layer = ForkConfigStatic({
				chainId: 1n,
				blockTag: 18000000n,
			})

			const program = Effect.gen(function* () {
				const config = yield* ForkConfigService
				return config
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result).toBeDefined()
		})
	})

	describe('configuration values', () => {
		it('should provide the exact chainId passed', async () => {
			const layer = ForkConfigStatic({
				chainId: 10n,
				blockTag: 0n,
			})

			const program = Effect.gen(function* () {
				const config = yield* ForkConfigService
				return config.chainId
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result).toBe(10n)
		})

		it('should provide the exact blockTag passed', async () => {
			const layer = ForkConfigStatic({
				chainId: 1n,
				blockTag: 123456789n,
			})

			const program = Effect.gen(function* () {
				const config = yield* ForkConfigService
				return config.blockTag
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result).toBe(123456789n)
		})

		it('should work with Ethereum mainnet config', async () => {
			const layer = ForkConfigStatic({
				chainId: 1n,
				blockTag: 19000000n,
			})

			const program = Effect.gen(function* () {
				const config = yield* ForkConfigService
				return { chainId: config.chainId, blockTag: config.blockTag }
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result).toEqual({ chainId: 1n, blockTag: 19000000n })
		})

		it('should work with Optimism config', async () => {
			const layer = ForkConfigStatic({
				chainId: 10n,
				blockTag: 115000000n,
			})

			const program = Effect.gen(function* () {
				const config = yield* ForkConfigService
				return { chainId: config.chainId, blockTag: config.blockTag }
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result).toEqual({ chainId: 10n, blockTag: 115000000n })
		})

		it('should work with zero blockTag (genesis)', async () => {
			const layer = ForkConfigStatic({
				chainId: 1n,
				blockTag: 0n,
			})

			const program = Effect.gen(function* () {
				const config = yield* ForkConfigService
				return config.blockTag
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result).toBe(0n)
		})

		it('should work with large block numbers', async () => {
			const largeBlock = 9999999999999n

			const layer = ForkConfigStatic({
				chainId: 1n,
				blockTag: largeBlock,
			})

			const program = Effect.gen(function* () {
				const config = yield* ForkConfigService
				return config.blockTag
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result).toBe(largeBlock)
		})
	})

	describe('immutability', () => {
		it('should provide the same config on multiple accesses', async () => {
			const config = {
				chainId: 1n,
				blockTag: 18000000n,
			}

			const layer = ForkConfigStatic(config)

			const program = Effect.gen(function* () {
				const config1 = yield* ForkConfigService
				const config2 = yield* ForkConfigService
				return [config1, config2]
			})

			const [result1, result2] = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(result1).toBe(result2)
		})
	})
})
