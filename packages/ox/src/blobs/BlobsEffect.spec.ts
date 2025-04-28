import { Effect } from 'effect'
import * as Blobs from 'ox/core/Blobs'
import * as Bytes from 'ox/core/Bytes'
import * as Hex from 'ox/core/Hex'
import { describe, expect, it } from 'vitest'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'
import { BlobsEffectLive } from './BlobsEffect.js'

describe('BlobsEffect', () => {
	// Create a sample blob for testing
	const createTestBlob = () => {
		// Create a blob filled with zeros
		return new Uint8Array(131072).fill(0)
	}

	describe('fromBytesEffect', () => {
		it('should convert Bytes to a Blob', async () => {
			const bytes = createTestBlob()
			const program = BlobsEffectLive.fromBytesEffect(bytes)
			const result = await Effect.runPromise(program)
			expect(result).toBeDefined()
		})
	})

	describe('fromHexEffect', () => {
		it('should convert Hex to a Blob', async () => {
			const bytes = createTestBlob()
			const hex = Hex.fromBytes(bytes)
			const program = BlobsEffectLive.fromHexEffect(hex)
			const result = await Effect.runPromise(program)
			expect(result).toBeDefined()
		})
	})

	describe('toBytesEffect', () => {
		it('should convert a Blob to Bytes', async () => {
			const bytes = createTestBlob()
			const blob = await Effect.runPromise(BlobsEffectLive.fromBytesEffect(bytes))
			const program = BlobsEffectLive.toBytesEffect(blob)
			const result = await Effect.runPromise(program)
			expect(result).toBeInstanceOf(Uint8Array)
		})
	})

	describe('toHexEffect', () => {
		it('should convert a Blob to Hex', async () => {
			const bytes = createTestBlob()
			const blob = await Effect.runPromise(BlobsEffectLive.fromBytesEffect(bytes))
			const program = BlobsEffectLive.toHexEffect(blob)
			const result = await Effect.runPromise(program)
			expect(result).toMatch(/^0x/)
		})
	})

	describe('isBlobEffect', () => {
		it('should verify if Bytes is a valid blob format', async () => {
			const bytes = createTestBlob()
			const program = BlobsEffectLive.isBlobEffect(bytes)
			const result = await Effect.runPromise(program)
			expect(typeof result).toBe('boolean')
		})
	})

	describe('isValidEffect', () => {
		it('should verify if blob is a valid 4844 blob', async () => {
			const bytes = createTestBlob()
			const program = BlobsEffectLive.isValidEffect(bytes)
			const result = await Effect.runPromise(program)
			expect(typeof result).toBe('boolean')
		})
	})

	describe('toVersionedHashEffect', () => {
		it('should create a versioned hash from a commitment', async () => {
			// Create a sample commitment (32 bytes)
			const commitment = new Uint8Array(32).fill(1)
			const program = BlobsEffectLive.toVersionedHashEffect(commitment)
			const result = await Effect.runPromise(program)
			expect(result).toBeInstanceOf(Uint8Array)
			expect(result.length).toBe(32)
		})
	})

	describe('error handling', () => {
		it('should handle errors correctly', async () => {
			// Create an invalid commitment (wrong length)
			const invalidCommitment = new Uint8Array(10).fill(1) // Too short

			const program = BlobsEffectLive.toVersionedHashEffect(invalidCommitment)

			try {
				await Effect.runPromise(program)
				expect.fail('Should have thrown an error')
			} catch (error) {
				expect(error).toBeInstanceOf(BaseErrorEffect)
			}
		})
	})
})
