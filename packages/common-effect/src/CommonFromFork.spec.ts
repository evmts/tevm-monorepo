import { ForkConfigStatic } from '@tevm/transport-effect'
import { Effect, Layer } from 'effect'
import { describe, expect, it } from 'vitest'
import { CommonFromFork } from './CommonFromFork.js'
import { CommonService } from './CommonService.js'

describe('CommonFromFork', () => {
	// Helper to create a mock ForkConfigService layer
	const createMockForkConfig = (chainId: bigint, blockTag: bigint = 1000000n) => ForkConfigStatic({ chainId, blockTag })

	describe('with ForkConfigService', () => {
		it('should create CommonService using chain ID from ForkConfigService', async () => {
			const program = Effect.gen(function* () {
				const common = yield* CommonService
				return common.chainId
			})

			const forkConfigLayer = createMockForkConfig(10n) // Optimism
			const commonLayer = Layer.provide(CommonFromFork(), forkConfigLayer)
			const fullLayer = Layer.merge(forkConfigLayer, commonLayer)

			const chainId = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))

			expect(chainId).toBe(10)
		})

		it('should use default hardfork (prague)', async () => {
			const program = Effect.gen(function* () {
				const common = yield* CommonService
				return common.hardfork
			})

			const forkConfigLayer = createMockForkConfig(1n)
			const commonLayer = Layer.provide(CommonFromFork(), forkConfigLayer)
			const fullLayer = Layer.merge(forkConfigLayer, commonLayer)

			const hardfork = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))

			expect(hardfork).toBe('prague')
		})

		it('should include default EIPs', async () => {
			const program = Effect.gen(function* () {
				const common = yield* CommonService
				return common.eips
			})

			const forkConfigLayer = createMockForkConfig(1n)
			const commonLayer = Layer.provide(CommonFromFork(), forkConfigLayer)
			const fullLayer = Layer.merge(forkConfigLayer, commonLayer)

			const eips = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))

			expect(eips).toContain(1559)
			expect(eips).toContain(4844)
		})
	})

	describe('with custom options', () => {
		it('should use custom hardfork when specified', async () => {
			const program = Effect.gen(function* () {
				const common = yield* CommonService
				return common.hardfork
			})

			const forkConfigLayer = createMockForkConfig(1n)
			const commonLayer = Layer.provide(CommonFromFork({ hardfork: 'cancun' }), forkConfigLayer)
			const fullLayer = Layer.merge(forkConfigLayer, commonLayer)

			const hardfork = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))

			expect(hardfork).toBe('cancun')
		})

		it('should include custom EIPs', async () => {
			const customEip = 7702
			const program = Effect.gen(function* () {
				const common = yield* CommonService
				return common.eips
			})

			const forkConfigLayer = createMockForkConfig(1n)
			const commonLayer = Layer.provide(CommonFromFork({ eips: [customEip] }), forkConfigLayer)
			const fullLayer = Layer.merge(forkConfigLayer, commonLayer)

			const eips = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))

			expect(eips).toContain(customEip)
		})

		it('should apply all custom options', async () => {
			const program = Effect.gen(function* () {
				const common = yield* CommonService
				return {
					chainId: common.chainId,
					hardfork: common.hardfork,
					eips: common.eips,
				}
			})

			const forkConfigLayer = createMockForkConfig(42161n) // Arbitrum
			const commonLayer = Layer.provide(
				CommonFromFork({
					hardfork: 'prague',
					eips: [7702],
				}),
				forkConfigLayer,
			)
			const fullLayer = Layer.merge(forkConfigLayer, commonLayer)

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))

			expect(result.chainId).toBe(42161)
			expect(result.hardfork).toBe('prague')
			expect(result.eips).toContain(7702)
		})
	})

	describe('copy() method', () => {
		it('should return a copy of the Common object', async () => {
			const program = Effect.gen(function* () {
				const commonService = yield* CommonService
				const copy = commonService.copy()
				return { original: commonService.common, copy }
			})

			const forkConfigLayer = createMockForkConfig(1n)
			const commonLayer = Layer.provide(CommonFromFork(), forkConfigLayer)
			const fullLayer = Layer.merge(forkConfigLayer, commonLayer)

			const { original, copy } = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))

			expect(copy).toBeDefined()
			expect(copy).not.toBe(original)
			expect(copy.id).toBe(original.id)
		})
	})

	describe('ethereumjs Common access', () => {
		it('should provide access to ethjsCommon', async () => {
			const program = Effect.gen(function* () {
				const commonService = yield* CommonService
				const ethjsCommon = commonService.common.ethjsCommon
				return {
					isEip1559Active: ethjsCommon.isActivatedEIP(1559),
					isEip4844Active: ethjsCommon.isActivatedEIP(4844),
				}
			})

			const forkConfigLayer = createMockForkConfig(1n)
			const commonLayer = Layer.provide(CommonFromFork(), forkConfigLayer)
			const fullLayer = Layer.merge(forkConfigLayer, commonLayer)

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))

			expect(result.isEip1559Active).toBe(true)
			expect(result.isEip4844Active).toBe(true)
		})
	})

	describe('layer dependency', () => {
		it('should require ForkConfigService', async () => {
			// This test verifies that CommonFromFork needs ForkConfigService
			const program = Effect.gen(function* () {
				const common = yield* CommonService
				return common.chainId
			})

			// Without ForkConfigService, this should cause a type error
			// and runtime error if executed
			const commonLayer = CommonFromFork()

			// We need to provide ForkConfigService for it to work
			const forkConfigLayer = createMockForkConfig(100n)
			const fullLayer = Layer.merge(forkConfigLayer, Layer.provide(commonLayer, forkConfigLayer))

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
			expect(result).toBe(100)
		})
	})

	describe('various chain IDs', () => {
		it.each([
			[1n, 'Mainnet'],
			[10n, 'Optimism'],
			[137n, 'Polygon'],
			[42161n, 'Arbitrum'],
			[8453n, 'Base'],
		])('should work with chain ID %s (%s)', async (chainId, _name) => {
			const program = Effect.gen(function* () {
				const common = yield* CommonService
				return common.chainId
			})

			const forkConfigLayer = createMockForkConfig(chainId)
			const commonLayer = Layer.provide(CommonFromFork(), forkConfigLayer)
			const fullLayer = Layer.merge(forkConfigLayer, commonLayer)

			const result = await Effect.runPromise(program.pipe(Effect.provide(fullLayer)))

			expect(result).toBe(Number(chainId))
		})
	})
})
