import { Effect } from 'effect'
import { describe, expect, it } from 'vitest'
import * as Authorization from './Authorization.js'

describe('Authorization module', () => {
	const testAuthorizationTuple = {
		address: '0x0000000000000000000000000000000000000000',
		blockNumber: 1n,
		chainId: 1,
		startTimestamp: 1000n,
		endTimestamp: 2000n,
		nonce: '0x0000000000000000000000000000000000000000000000000000000000000001',
		operation: 'deploy',
	}

	it('should create an Authorization from tuple', async () => {
		const result = await Effect.runPromise(Authorization.fromTuple(testAuthorizationTuple))

		expect(result).toHaveProperty('address', '0x0000000000000000000000000000000000000000')
		expect(result).toHaveProperty('operation', 'deploy')
	})

	it('should create an Authorization list from tuple list', async () => {
		const result = await Effect.runPromise(Authorization.fromTupleList([testAuthorizationTuple]))

		expect(result).toHaveLength(1)
		expect(result[0]).toHaveProperty('address', '0x0000000000000000000000000000000000000000')
	})

	it('should convert Authorization to RPC and back', async () => {
		const authorization = await Effect.runPromise(Authorization.fromTuple(testAuthorizationTuple))

		const rpc = await Effect.runPromise(Authorization.toRpc(authorization))

		expect(rpc).toHaveProperty('address', '0x0000000000000000000000000000000000000000')
		expect(rpc).toHaveProperty('blockNumber', '0x1')

		const backToAuth = await Effect.runPromise(Authorization.fromRpc(rpc))

		expect(backToAuth).toHaveProperty('address', '0x0000000000000000000000000000000000000000')
		expect(backToAuth).toHaveProperty('operation', 'deploy')
	})

	it('should create the sign payload for an Authorization', async () => {
		const authorization = await Effect.runPromise(Authorization.fromTuple(testAuthorizationTuple))

		const payload = await Effect.runPromise(Authorization.getSignPayload(authorization))

		expect(typeof payload).toBe('string')
		expect(payload).toContain('Authorization')
	})

	it('should hash an Authorization', async () => {
		const authorization = await Effect.runPromise(Authorization.fromTuple(testAuthorizationTuple))

		const hash = await Effect.runPromise(Authorization.hash(authorization))

		expect(hash).toBeInstanceOf(Uint8Array)
	})

	it('should handle invalid inputs correctly', async () => {
		const invalidTuple = {
			// Missing required properties
			address: '0x0000000000000000000000000000000000000000',
			chainId: 1,
		}

		try {
			await Effect.runPromise(Authorization.fromTuple(invalidTuple as any))
			// Should not reach here
			expect(true).toBe(false)
		} catch (error) {
			expect(error).toBeInstanceOf(Authorization.FromTupleError)
		}
	})
})
