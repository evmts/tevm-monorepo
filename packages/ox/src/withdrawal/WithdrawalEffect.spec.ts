import { Effect } from 'effect'
import { describe, expect, it } from 'vitest'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'
import { WithdrawalEffectLayer, WithdrawalEffectService, WithdrawalEffectTag } from './WithdrawalEffect.js'

describe('WithdrawalEffect', () => {
	const validWithdrawal = {
		index: 1n,
		validatorIndex: 2n,
		address: '0x1234567890123456789012345678901234567890',
		amount: 32000000000n,
	}

	const invalidWithdrawal = {
		index: 'not a number',
		validatorIndex: 'not a number',
		address: 'invalid address',
		amount: 'not a number',
	}

	it('should assert valid withdrawal', async () => {
		const program = Effect.gen(function* (_) {
			const withdrawalEffect = yield* _(WithdrawalEffectTag)
			const result = yield* _(withdrawalEffect.assertEffect(validWithdrawal))
			return result
		}).pipe(Effect.provide(WithdrawalEffectLayer))

		await expect(Effect.runPromise(program)).resolves.toBeUndefined()
	})

	it('should fail when asserting invalid withdrawal', async () => {
		const program = Effect.gen(function* (_) {
			const withdrawalEffect = yield* _(WithdrawalEffectTag)
			const result = yield* _(withdrawalEffect.assertEffect(invalidWithdrawal))
			return result
		}).pipe(Effect.provide(WithdrawalEffectLayer))

		await expect(Effect.runPromise(program)).rejects.toBeInstanceOf(BaseErrorEffect)
	})

	it('should check if value is a withdrawal', async () => {
		const program = Effect.gen(function* (_) {
			const withdrawalEffect = yield* _(WithdrawalEffectTag)
			const isValid = yield* _(withdrawalEffect.isWithdrawalEffect(validWithdrawal))
			const isInvalid = yield* _(withdrawalEffect.isWithdrawalEffect(invalidWithdrawal))
			return { isValid, isInvalid }
		}).pipe(Effect.provide(WithdrawalEffectLayer))

		const result = await Effect.runPromise(program)
		expect(result.isValid).toBe(true)
		expect(result.isInvalid).toBe(false)
	})

	it('should validate withdrawal', async () => {
		const program = Effect.gen(function* (_) {
			const withdrawalEffect = yield* _(WithdrawalEffectTag)
			const isValid = yield* _(withdrawalEffect.validateEffect(validWithdrawal))
			const isInvalid = yield* _(withdrawalEffect.validateEffect(invalidWithdrawal))
			return { isValid, isInvalid }
		}).pipe(Effect.provide(WithdrawalEffectLayer))

		const result = await Effect.runPromise(program)
		expect(result.isValid).toBe(true)
		expect(result.isInvalid).toBe(false)
	})
})
