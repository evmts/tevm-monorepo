import { describe, it, expect } from 'vitest'
import { Effect, Exit } from 'effect'
import { ImpersonationService } from './ImpersonationService.js'
import { ImpersonationLive } from './ImpersonationLive.js'

describe('ImpersonationLive', () => {
	describe('layer creation', () => {
		it('should create a layer', () => {
			const layer = ImpersonationLive()
			expect(layer).toBeDefined()
		})

		it('should accept options', () => {
			const layer = ImpersonationLive({
				initialAccount: '0x1234567890123456789012345678901234567890',
				autoImpersonate: true,
			})
			expect(layer).toBeDefined()
		})
	})

	describe('impersonated account', () => {
		it('should return undefined when no account is impersonated', async () => {
			const program = Effect.gen(function* () {
				const impersonation = yield* ImpersonationService
				return yield* impersonation.getImpersonatedAccount
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(ImpersonationLive())))
			expect(result).toBeUndefined()
		})

		it('should set and get impersonated account', async () => {
			const address = '0x1234567890123456789012345678901234567890' as const
			const program = Effect.gen(function* () {
				const impersonation = yield* ImpersonationService
				yield* impersonation.setImpersonatedAccount(address)
				return yield* impersonation.getImpersonatedAccount
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(ImpersonationLive())))
			expect(result).toBe(address)
		})

		it('should clear impersonated account when set to undefined', async () => {
			const address = '0x1234567890123456789012345678901234567890' as const
			const program = Effect.gen(function* () {
				const impersonation = yield* ImpersonationService
				yield* impersonation.setImpersonatedAccount(address)
				yield* impersonation.setImpersonatedAccount(undefined)
				return yield* impersonation.getImpersonatedAccount
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(ImpersonationLive())))
			expect(result).toBeUndefined()
		})

		it('should use initial account from options', async () => {
			const address = '0xabcdef1234567890abcdef1234567890abcdef12' as const
			const program = Effect.gen(function* () {
				const impersonation = yield* ImpersonationService
				return yield* impersonation.getImpersonatedAccount
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(ImpersonationLive({ initialAccount: address }))),
			)
			expect(result).toBe(address)
		})
	})

	describe('auto impersonate', () => {
		it('should return false by default', async () => {
			const program = Effect.gen(function* () {
				const impersonation = yield* ImpersonationService
				return yield* impersonation.getAutoImpersonate
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(ImpersonationLive())))
			expect(result).toBe(false)
		})

		it('should set and get auto impersonate', async () => {
			const program = Effect.gen(function* () {
				const impersonation = yield* ImpersonationService
				yield* impersonation.setAutoImpersonate(true)
				return yield* impersonation.getAutoImpersonate
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(ImpersonationLive())))
			expect(result).toBe(true)
		})

		it('should toggle auto impersonate', async () => {
			const program = Effect.gen(function* () {
				const impersonation = yield* ImpersonationService
				yield* impersonation.setAutoImpersonate(true)
				yield* impersonation.setAutoImpersonate(false)
				return yield* impersonation.getAutoImpersonate
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(ImpersonationLive())))
			expect(result).toBe(false)
		})

		it('should use initial auto impersonate from options', async () => {
			const program = Effect.gen(function* () {
				const impersonation = yield* ImpersonationService
				return yield* impersonation.getAutoImpersonate
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(ImpersonationLive({ autoImpersonate: true }))),
			)
			expect(result).toBe(true)
		})
	})

	describe('deepCopy', () => {
		it('should create an independent copy', async () => {
			const address1 = '0x1111111111111111111111111111111111111111' as const
			const address2 = '0x2222222222222222222222222222222222222222' as const

			const program = Effect.gen(function* () {
				const impersonation = yield* ImpersonationService
				yield* impersonation.setImpersonatedAccount(address1)
				yield* impersonation.setAutoImpersonate(true)

				// Create deep copy
				const copy = yield* impersonation.deepCopy()

				// Modify original
				yield* impersonation.setImpersonatedAccount(address2)
				yield* impersonation.setAutoImpersonate(false)

				// Check copy is unchanged
				const copiedAccount = yield* copy.getImpersonatedAccount
				const copiedAuto = yield* copy.getAutoImpersonate

				// Check original is changed
				const originalAccount = yield* impersonation.getImpersonatedAccount
				const originalAuto = yield* impersonation.getAutoImpersonate

				return {
					copiedAccount,
					copiedAuto,
					originalAccount,
					originalAuto,
				}
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(ImpersonationLive())))
			expect(result.copiedAccount).toBe(address1)
			expect(result.copiedAuto).toBe(true)
			expect(result.originalAccount).toBe(address2)
			expect(result.originalAuto).toBe(false)
		})

		it('should allow independent modification of copy', async () => {
			const program = Effect.gen(function* () {
				const impersonation = yield* ImpersonationService
				const copy = yield* impersonation.deepCopy()

				// Modify copy
				yield* copy.setImpersonatedAccount('0x3333333333333333333333333333333333333333')

				// Original should be unchanged
				return yield* impersonation.getImpersonatedAccount
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(ImpersonationLive())))
			expect(result).toBeUndefined()
		})
	})

	describe('concurrent access', () => {
		it('should handle concurrent reads and writes', async () => {
			const program = Effect.gen(function* () {
				const impersonation = yield* ImpersonationService

				// Run concurrent operations
				yield* Effect.all([
					impersonation.setImpersonatedAccount('0x1111111111111111111111111111111111111111'),
					impersonation.setAutoImpersonate(true),
					impersonation.getImpersonatedAccount,
					impersonation.getAutoImpersonate,
				])

				// Final state should be consistent
				const account = yield* impersonation.getImpersonatedAccount
				const auto = yield* impersonation.getAutoImpersonate

				return { account, auto }
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(ImpersonationLive())))
			// Both should have been set
			expect(result.account).toBe('0x1111111111111111111111111111111111111111')
			expect(result.auto).toBe(true)
		})
	})
})
