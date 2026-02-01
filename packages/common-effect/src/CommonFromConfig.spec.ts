import { describe, it, expect } from 'vitest'
import { Effect, Layer } from 'effect'
import { CommonService } from './CommonService.js'
import { CommonFromConfig } from './CommonFromConfig.js'

describe('CommonFromConfig', () => {
	describe('default configuration', () => {
		it('should create CommonService with default values', async () => {
			const program = Effect.gen(function* () {
				const common = yield* CommonService
				return {
					chainId: common.chainId,
					hardfork: common.hardfork,
					eips: common.eips,
				}
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(CommonFromConfig())),
			)

			expect(result.chainId).toBe(900) // tevm-devnet default
			expect(result.hardfork).toBe('prague')
			expect(result.eips).toContain(1559) // Default EIP
		})

		it('should provide a valid Common object', async () => {
			const program = Effect.gen(function* () {
				const commonService = yield* CommonService
				return commonService.common
			})

			const common = await Effect.runPromise(
				program.pipe(Effect.provide(CommonFromConfig())),
			)

			expect(common).toBeDefined()
			expect(common.id).toBe(900)
			expect(common.ethjsCommon).toBeDefined()
		})
	})

	describe('custom configuration', () => {
		it('should create CommonService with custom chain ID', async () => {
			const program = Effect.gen(function* () {
				const common = yield* CommonService
				return common.chainId
			})

			const chainId = await Effect.runPromise(
				program.pipe(Effect.provide(CommonFromConfig({ chainId: 1 }))),
			)

			expect(chainId).toBe(1)
		})

		it('should create CommonService with custom hardfork', async () => {
			const program = Effect.gen(function* () {
				const common = yield* CommonService
				return common.hardfork
			})

			const hardfork = await Effect.runPromise(
				program.pipe(Effect.provide(CommonFromConfig({ hardfork: 'cancun' }))),
			)

			expect(hardfork).toBe('cancun')
		})

		it('should include custom EIPs in the EIPs list', async () => {
			const customEip = 7702
			const program = Effect.gen(function* () {
				const common = yield* CommonService
				return common.eips
			})

			const eips = await Effect.runPromise(
				program.pipe(Effect.provide(CommonFromConfig({ eips: [customEip] }))),
			)

			expect(eips).toContain(customEip)
			// Should also contain default EIPs
			expect(eips).toContain(1559)
		})

		it('should create with multiple custom options', async () => {
			const program = Effect.gen(function* () {
				const common = yield* CommonService
				return {
					chainId: common.chainId,
					hardfork: common.hardfork,
					eips: common.eips,
				}
			})

			const result = await Effect.runPromise(
				program.pipe(
					Effect.provide(
						CommonFromConfig({
							chainId: 10,
							hardfork: 'prague',
							eips: [7702],
						}),
					),
				),
			)

			expect(result.chainId).toBe(10)
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

			const { original, copy } = await Effect.runPromise(
				program.pipe(Effect.provide(CommonFromConfig())),
			)

			expect(copy).toBeDefined()
			expect(copy).not.toBe(original) // Should be a different object
			expect(copy.id).toBe(original.id)
		})

		it('should create independent copies', async () => {
			const program = Effect.gen(function* () {
				const commonService = yield* CommonService
				const copy1 = commonService.copy()
				const copy2 = commonService.copy()
				return { copy1, copy2 }
			})

			const { copy1, copy2 } = await Effect.runPromise(
				program.pipe(Effect.provide(CommonFromConfig())),
			)

			expect(copy1).not.toBe(copy2)
		})
	})

	describe('layer composition', () => {
		it('should be a valid Layer with no dependencies', async () => {
			const layer = CommonFromConfig()
			expect(layer).toBeDefined()

			// Verify layer can be provided directly (no other layers needed)
			const program = Effect.gen(function* () {
				const common = yield* CommonService
				return common.chainId
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(layer)))
			expect(typeof result).toBe('number')
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

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(CommonFromConfig())),
			)

			expect(result.isEip1559Active).toBe(true)
			expect(result.isEip4844Active).toBe(true)
		})
	})
})
