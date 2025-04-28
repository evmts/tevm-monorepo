import { Effect } from 'effect'
import * as Bls from 'ox/core/Bls'
import * as Bytes from 'ox/core/Bytes'
import * as Hex from 'ox/core/Hex'
import { describe, expect, it } from 'vitest'
import * as BlsPoint from './BlsPoint.js'

describe('BlsPoint', () => {
	it('should convert G1 point to bytes and back', async () => {
		// Generate a BLS key pair to get a G1 point (public key)
		const privateKey = await Effect.runPromise(Effect.try(() => Bls.randomPrivateKey()))
		const publicKey = await Effect.runPromise(Effect.try(() => Bls.getPublicKey(privateKey)))

		// Convert to bytes
		const bytes = await Effect.runPromise(BlsPoint.toBytes(publicKey))
		expect(bytes).toBeInstanceOf(Uint8Array)

		// Convert back to point
		const recoveredPoint = await Effect.runPromise(BlsPoint.fromBytes(bytes, 'G1'))

		// Convert both to hex for comparison
		const originalHex = await Effect.runPromise(BlsPoint.toHex(publicKey))
		const recoveredHex = await Effect.runPromise(BlsPoint.toHex(recoveredPoint))

		// Should be the same point
		expect(recoveredHex).toEqual(originalHex)
	})

	it('should convert G1 point to hex and back', async () => {
		// Generate a BLS key pair to get a G1 point
		const privateKey = await Effect.runPromise(Effect.try(() => Bls.randomPrivateKey()))
		const publicKey = await Effect.runPromise(Effect.try(() => Bls.getPublicKey(privateKey)))

		// Convert to hex
		const hex = await Effect.runPromise(BlsPoint.toHex(publicKey))
		expect(typeof hex).toBe('string')
		expect(hex.startsWith('0x')).toBe(true)

		// Convert back to point
		const recoveredPoint = await Effect.runPromise(BlsPoint.fromHex(hex, 'G1'))

		// Convert both to hex for comparison
		const originalHex = await Effect.runPromise(BlsPoint.toHex(publicKey))
		const recoveredHex = await Effect.runPromise(BlsPoint.toHex(recoveredPoint))

		// Should be the same point
		expect(recoveredHex).toEqual(originalHex)
	})

	it('should work with G2 points (signatures)', async () => {
		// Generate a signature (G2 point)
		const privateKey = await Effect.runPromise(Effect.try(() => Bls.randomPrivateKey()))
		const message = Bytes.random(32)
		const signature = await Effect.runPromise(Effect.try(() => Bls.sign(message, privateKey)))

		// Convert to bytes
		const bytes = await Effect.runPromise(BlsPoint.toBytes(signature))
		expect(bytes).toBeInstanceOf(Uint8Array)
		expect(bytes.length).toBe(96) // G2 points are 96 bytes

		// Convert to hex
		const hex = await Effect.runPromise(BlsPoint.toHex(signature))

		// Convert back to point
		const recoveredFromBytes = await Effect.runPromise(BlsPoint.fromBytes(bytes, 'G2'))
		const recoveredFromHex = await Effect.runPromise(BlsPoint.fromHex(hex, 'G2'))

		// Check the Fp2 structure (G2 point specific properties)
		expect(recoveredFromBytes.x).toHaveProperty('c0')
		expect(recoveredFromBytes.x).toHaveProperty('c1')
		expect(typeof recoveredFromBytes.x.c0).toBe('bigint')
		expect(typeof recoveredFromBytes.x.c1).toBe('bigint')

		expect(recoveredFromHex.x).toHaveProperty('c0')
		expect(recoveredFromHex.x).toHaveProperty('c1')
	})

	it('should handle errors when converting invalid bytes to BLS point', async () => {
		// Create invalid bytes (wrong length)
		const invalidBytes = Bytes.random(10) // Too short for a BLS point

		// Try to convert to a BLS point
		const program = BlsPoint.fromBytes(invalidBytes, 'G1')
		const result = await Effect.runPromise(Effect.either(program))

		// Should fail with the correct error
		expect(result._tag).toBe('Left')
		if (result._tag === 'Left') {
			expect(result.left).toBeInstanceOf(BlsPoint.FromBytesError)
			expect(result.left.name).toBe('FromBytesError')
			expect(result.left._tag).toBe('FromBytesError')
		}
	})

	it('should handle errors when converting invalid hex to BLS point', async () => {
		// Create invalid hex (too short)
		const invalidHex = '0x123'

		// Try to convert to a BLS point
		const program = BlsPoint.fromHex(invalidHex as Hex.Hex, 'G1')
		const result = await Effect.runPromise(Effect.either(program))

		// Should fail with the correct error
		expect(result._tag).toBe('Left')
		if (result._tag === 'Left') {
			expect(result.left).toBeInstanceOf(BlsPoint.FromHexError)
			expect(result.left.name).toBe('FromHexError')
			expect(result.left._tag).toBe('FromHexError')
		}
	})
})
