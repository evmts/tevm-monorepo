import { Effect } from 'effect'
import { describe, expect, it } from 'vitest'
import { CommonLocal } from './CommonLocal.js'
import { CommonService } from './CommonService.js'

describe('CommonLocal', () => {
	describe('default configuration', () => {
		it('should provide CommonService with tevm-devnet defaults', async () => {
			const program = Effect.gen(function* () {
				const common = yield* CommonService
				return {
					chainId: common.chainId,
					hardfork: common.hardfork,
				}
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(CommonLocal)))

			expect(result.chainId).toBe(900) // tevm-devnet
			expect(result.hardfork).toBe('prague')
		})

		it('should provide default EIPs', async () => {
			const program = Effect.gen(function* () {
				const common = yield* CommonService
				return common.eips
			})

			const eips = await Effect.runPromise(program.pipe(Effect.provide(CommonLocal)))

			// Should contain default EIPs
			expect(eips).toContain(1559)
			expect(eips).toContain(4844)
			expect(eips).toContain(4895)
		})
	})

	describe('common object', () => {
		it('should provide a valid Common object', async () => {
			const program = Effect.gen(function* () {
				const commonService = yield* CommonService
				return commonService.common
			})

			const common = await Effect.runPromise(program.pipe(Effect.provide(CommonLocal)))

			expect(common).toBeDefined()
			expect(common.id).toBe(900)
			expect(common.ethjsCommon).toBeDefined()
		})

		it('should provide access to ethjsCommon', async () => {
			const program = Effect.gen(function* () {
				const commonService = yield* CommonService
				return commonService.common.ethjsCommon.isActivatedEIP(1559)
			})

			const isActive = await Effect.runPromise(program.pipe(Effect.provide(CommonLocal)))
			expect(isActive).toBe(true)
		})
	})

	describe('copy() method', () => {
		it('should return a copy of the Common object', async () => {
			const program = Effect.gen(function* () {
				const commonService = yield* CommonService
				const copy = commonService.copy()
				return { original: commonService.common, copy }
			})

			const { original, copy } = await Effect.runPromise(program.pipe(Effect.provide(CommonLocal)))

			expect(copy).toBeDefined()
			expect(copy).not.toBe(original)
			expect(copy.id).toBe(original.id)
		})
	})

	describe('layer type', () => {
		it('should be a Layer with no dependencies', async () => {
			// CommonLocal is a pre-built layer, can be used directly
			const program = Effect.gen(function* () {
				const common = yield* CommonService
				return common.chainId
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(CommonLocal)))
			expect(result).toBe(900)
		})
	})
})
