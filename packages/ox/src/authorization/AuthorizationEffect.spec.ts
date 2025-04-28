import { Effect, pipe } from 'effect'
import { describe, expect, it } from 'vitest'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'
import { AuthorizationEffectLayer, AuthorizationEffectTag } from './AuthorizationEffect.js'

describe('AuthorizationEffect', () => {
	const testAuthorizationTuple = {
		address: '0x0000000000000000000000000000000000000000',
		blockNumber: 1n,
		chainId: 1,
		startTimestamp: 1000n,
		endTimestamp: 2000n,
		nonce: '0x0000000000000000000000000000000000000000000000000000000000000001',
		operation: 'deploy',
	}

	it('should create an Authorization from tuple in an effect', async () => {
		const program = pipe(
			Effect.provide(
				Effect.flatMap(AuthorizationEffectTag, (auth) => auth.fromTupleEffect(testAuthorizationTuple)),
				AuthorizationEffectLayer,
			),
		)

		const result = await Effect.runPromise(program)
		expect(result).toHaveProperty('address', '0x0000000000000000000000000000000000000000')
		expect(result).toHaveProperty('operation', 'deploy')
	})

	it('should create an Authorization list from tuple list in an effect', async () => {
		const program = pipe(
			Effect.provide(
				Effect.flatMap(AuthorizationEffectTag, (auth) => auth.fromTupleListEffect([testAuthorizationTuple])),
				AuthorizationEffectLayer,
			),
		)

		const result = await Effect.runPromise(program)
		expect(result).toHaveLength(1)
		expect(result[0]).toHaveProperty('address', '0x0000000000000000000000000000000000000000')
	})

	it('should convert Authorization to RPC in an effect', async () => {
		const program = pipe(
			Effect.provide(
				Effect.flatMap(AuthorizationEffectTag, (auth) =>
					Effect.flatMap(auth.fromTupleEffect(testAuthorizationTuple), (authorization) =>
						auth.toRpcEffect(authorization),
					),
				),
				AuthorizationEffectLayer,
			),
		)

		const result = await Effect.runPromise(program)
		expect(result).toHaveProperty('address', '0x0000000000000000000000000000000000000000')
		expect(result).toHaveProperty('blockNumber', '0x1')
	})

	it('should convert Authorization to tuple in an effect', async () => {
		const program = pipe(
			Effect.provide(
				Effect.flatMap(AuthorizationEffectTag, (auth) =>
					Effect.flatMap(auth.fromTupleEffect(testAuthorizationTuple), (authorization) =>
						auth.toTupleEffect(authorization),
					),
				),
				AuthorizationEffectLayer,
			),
		)

		const result = await Effect.runPromise(program)
		expect(result).toEqual(testAuthorizationTuple)
	})

	it('should hash an Authorization in an effect', async () => {
		const program = pipe(
			Effect.provide(
				Effect.flatMap(AuthorizationEffectTag, (auth) =>
					Effect.flatMap(auth.fromTupleEffect(testAuthorizationTuple), (authorization) =>
						auth.hashEffect(authorization),
					),
				),
				AuthorizationEffectLayer,
			),
		)

		const result = await Effect.runPromise(program)
		expect(result).toBeInstanceOf(Uint8Array)
	})

	it('should get sign payload in an effect', async () => {
		const program = pipe(
			Effect.provide(
				Effect.flatMap(AuthorizationEffectTag, (auth) =>
					Effect.flatMap(auth.fromTupleEffect(testAuthorizationTuple), (authorization) =>
						auth.getSignPayloadEffect(authorization),
					),
				),
				AuthorizationEffectLayer,
			),
		)

		const result = await Effect.runPromise(program)
		expect(typeof result).toBe('string')
		expect(result).toContain('Authorization')
	})

	it('should handle invalid inputs correctly', async () => {
		const invalidTuple = {
			// Missing required properties
			address: '0x0000000000000000000000000000000000000000',
			chainId: 1,
		}

		const program = pipe(
			Effect.provide(
				Effect.flatMap(AuthorizationEffectTag, (auth) => auth.fromTupleEffect(invalidTuple as any)),
				AuthorizationEffectLayer,
			),
		)

		try {
			await Effect.runPromise(program)
			// Should not reach here
			expect(true).toBe(false)
		} catch (error) {
			expect(error).toBeInstanceOf(BaseErrorEffect)
		}
	})
})
