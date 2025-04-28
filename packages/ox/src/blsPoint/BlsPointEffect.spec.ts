import { Effect } from 'effect'
import * as BlsPoint from 'ox/core/BlsPoint'
import * as Bytes from 'ox/core/Bytes'
import * as Hex from 'ox/core/Hex'
import { describe, expect, it } from 'vitest'
import { BlsEffectLive } from '../bls/BlsEffect.js'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'
import { BlsPointEffectLive } from './BlsPointEffect.js'

describe('BlsPointEffect', () => {
	it('should wrap toBytes and fromBytes correctly for G1 points', async () => {
		// First, get a BLS G1 point (public key) to work with
		const privateKey = await Effect.runPromise(BlsEffectLive.randomPrivateKeyEffect())
		const publicKey = await Effect.runPromise(BlsEffectLive.getPublicKeyEffect({ privateKey }))

		// Convert to bytes
		const bytes = await Effect.runPromise(BlsPointEffectLive.toBytesEffect(publicKey))
		expect(bytes).toBeInstanceOf(Uint8Array)

		// Convert back to BLS point
		const recoveredPoint = await Effect.runPromise(BlsPointEffectLive.fromBytesEffect(bytes, 'G1'))
		expect(recoveredPoint).toBeDefined()

		// Convert original and recovered points to hex for comparison
		const originalHex = await Effect.runPromise(BlsPointEffectLive.toHexEffect(publicKey))
		const recoveredHex = await Effect.runPromise(BlsPointEffectLive.toHexEffect(recoveredPoint))

		// Hex representations should match
		expect(recoveredHex).toEqual(originalHex)
	})

	it('should wrap toHex and fromHex correctly for G1 points', async () => {
		// Get a BLS G1 point to work with
		const privateKey = await Effect.runPromise(BlsEffectLive.randomPrivateKeyEffect())
		const publicKey = await Effect.runPromise(BlsEffectLive.getPublicKeyEffect({ privateKey }))

		// Convert to hex
		const hex = await Effect.runPromise(BlsPointEffectLive.toHexEffect(publicKey))
		expect(typeof hex).toBe('string')
		expect(hex.startsWith('0x')).toBe(true)

		// Convert back to BLS point
		const recoveredPoint = await Effect.runPromise(BlsPointEffectLive.fromHexEffect(hex, 'G1'))
		expect(recoveredPoint).toBeDefined()

		// Convert both points to hex for comparison
		const originalHex = await Effect.runPromise(BlsPointEffectLive.toHexEffect(publicKey))
		const recoveredHex = await Effect.runPromise(BlsPointEffectLive.toHexEffect(recoveredPoint))

		// Hex representations should match
		expect(recoveredHex).toEqual(originalHex)
	})

	it('should work with G2 points from signatures', async () => {
		// Get a BLS signature (G2 point) to work with
		const privateKey = await Effect.runPromise(BlsEffectLive.randomPrivateKeyEffect())
		const payload = Hex.random(32)
		const signature = await Effect.runPromise(
			BlsEffectLive.signEffect({
				payload,
				privateKey,
			}),
		)

		// Test the G2 point operations
		const bytes = await Effect.runPromise(BlsPointEffectLive.toBytesEffect(signature))
		expect(bytes).toBeInstanceOf(Uint8Array)
		expect(bytes.length).toBe(96) // G2 points are 96 bytes

		// Convert to hex and back
		const hex = await Effect.runPromise(BlsPointEffectLive.toHexEffect(signature))
		const recoveredPoint = await Effect.runPromise(BlsPointEffectLive.fromHexEffect(hex, 'G2'))

		// Check the Fp2 structure of the G2 point
		expect(recoveredPoint.x).toHaveProperty('c0')
		expect(recoveredPoint.x).toHaveProperty('c1')
		expect(typeof recoveredPoint.x.c0).toBe('bigint')
		expect(typeof recoveredPoint.x.c1).toBe('bigint')
	})

	it('should handle errors correctly with invalid inputs', async () => {
		// Try to create a BLS point from invalid bytes (wrong length)
		const invalidBytes = Bytes.random(10) // Wrong length for BLS point

		const program = BlsPointEffectLive.fromBytesEffect(invalidBytes, 'G1')

		try {
			await Effect.runPromise(program)
			expect.fail('Should have thrown an error')
		} catch (error) {
			expect(error).toBeInstanceOf(BaseErrorEffect)
		}
	})

	it('should handle errors correctly with invalid hex', async () => {
		// Try to create a BLS point from invalid hex
		const invalidHex = '0x123' // Too short and not a valid BLS point

		const program = BlsPointEffectLive.fromHexEffect(invalidHex as Hex.Hex, 'G1')

		try {
			await Effect.runPromise(program)
			expect.fail('Should have thrown an error')
		} catch (error) {
			expect(error).toBeInstanceOf(BaseErrorEffect)
		}
	})
})
