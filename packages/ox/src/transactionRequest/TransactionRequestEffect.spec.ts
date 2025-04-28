import { Effect } from 'effect'
import { describe, expect, it } from 'vitest'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'
import {
	TransactionRequestEffectLayer,
	TransactionRequestEffectService,
	TransactionRequestEffectTag,
} from './TransactionRequestEffect.js'

describe('TransactionRequestEffect', () => {
	const validTransactionRequest = {
		to: '0x1234567890123456789012345678901234567890',
		value: 1000000000000000000n,
		gas: 21000n,
	}

	const invalidTransactionRequest = {
		to: 'invalid address',
		value: 'not a number',
	}

	it('should assert valid transaction request', async () => {
		const program = Effect.gen(function* (_) {
			const transactionRequestEffect = yield* _(TransactionRequestEffectTag)
			const result = yield* _(transactionRequestEffect.assertEffect(validTransactionRequest))
			return result
		}).pipe(Effect.provide(TransactionRequestEffectLayer))

		await expect(Effect.runPromise(program)).resolves.toBeUndefined()
	})

	it('should fail when asserting invalid transaction request', async () => {
		const program = Effect.gen(function* (_) {
			const transactionRequestEffect = yield* _(TransactionRequestEffectTag)
			const result = yield* _(transactionRequestEffect.assertEffect(invalidTransactionRequest))
			return result
		}).pipe(Effect.provide(TransactionRequestEffectLayer))

		await expect(Effect.runPromise(program)).rejects.toBeInstanceOf(BaseErrorEffect)
	})

	it('should check if value is a transaction request', async () => {
		const program = Effect.gen(function* (_) {
			const transactionRequestEffect = yield* _(TransactionRequestEffectTag)
			const isValid = yield* _(transactionRequestEffect.isTransactionRequestEffect(validTransactionRequest))
			const isInvalid = yield* _(transactionRequestEffect.isTransactionRequestEffect(invalidTransactionRequest))
			return { isValid, isInvalid }
		}).pipe(Effect.provide(TransactionRequestEffectLayer))

		const result = await Effect.runPromise(program)
		expect(result.isValid).toBe(true)
		expect(result.isInvalid).toBe(false)
	})

	it('should validate transaction request', async () => {
		const program = Effect.gen(function* (_) {
			const transactionRequestEffect = yield* _(TransactionRequestEffectTag)
			const isValid = yield* _(transactionRequestEffect.validateEffect(validTransactionRequest))
			const isInvalid = yield* _(transactionRequestEffect.validateEffect(invalidTransactionRequest))
			return { isValid, isInvalid }
		}).pipe(Effect.provide(TransactionRequestEffectLayer))

		const result = await Effect.runPromise(program)
		expect(result.isValid).toBe(true)
		expect(result.isInvalid).toBe(false)
	})
})
