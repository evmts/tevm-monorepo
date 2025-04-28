import { Effect } from 'effect'
import { describe, expect, it } from 'vitest'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'
import { AccessListEffectLayer, AccessListEffectTag } from './AccessListEffect.js'

describe('AccessListEffect', () => {
	const validAccessList = [
		{
			address: '0x1234567890123456789012345678901234567890',
			storageKeys: [
				'0x0000000000000000000000000000000000000000000000000000000000000001',
				'0x0000000000000000000000000000000000000000000000000000000000000002',
			],
		},
	]

	const invalidAccessList = [
		{
			address: 'invalid address',
			storageKeys: ['invalid storage key'],
		},
	]

	it('should assert valid access list', async () => {
		const program = Effect.gen(function* (_) {
			const accessListEffect = yield* _(AccessListEffectTag)
			const result = yield* _(accessListEffect.assertEffect(validAccessList))
			return result
		}).pipe(Effect.provide(AccessListEffectLayer))

		await expect(Effect.runPromise(program)).resolves.toBeUndefined()
	})

	it('should fail when asserting invalid access list', async () => {
		const program = Effect.gen(function* (_) {
			const accessListEffect = yield* _(AccessListEffectTag)
			const result = yield* _(accessListEffect.assertEffect(invalidAccessList))
			return result
		}).pipe(Effect.provide(AccessListEffectLayer))

		await expect(Effect.runPromise(program)).rejects.toBeInstanceOf(BaseErrorEffect)
	})

	it('should check if value is an access list', async () => {
		const program = Effect.gen(function* (_) {
			const accessListEffect = yield* _(AccessListEffectTag)
			const isValid = yield* _(accessListEffect.isAccessListEffect(validAccessList))
			const isInvalid = yield* _(accessListEffect.isAccessListEffect(invalidAccessList))
			return { isValid, isInvalid }
		}).pipe(Effect.provide(AccessListEffectLayer))

		const result = await Effect.runPromise(program)
		expect(result.isValid).toBe(true)
		expect(result.isInvalid).toBe(false)
	})

	it('should validate access list', async () => {
		const program = Effect.gen(function* (_) {
			const accessListEffect = yield* _(AccessListEffectTag)
			const isValid = yield* _(accessListEffect.validateEffect(validAccessList))
			const isInvalid = yield* _(accessListEffect.validateEffect(invalidAccessList))
			return { isValid, isInvalid }
		}).pipe(Effect.provide(AccessListEffectLayer))

		const result = await Effect.runPromise(program)
		expect(result.isValid).toBe(true)
		expect(result.isInvalid).toBe(false)
	})
})
