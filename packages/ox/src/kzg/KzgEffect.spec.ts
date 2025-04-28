import { Effect } from 'effect'
import * as Bytes from 'ox/core/Bytes'
import type { Kzg } from 'ox/core/Kzg'
import { describe, expect, it, vi } from 'vitest'
import { KzgEffectLive } from './KzgEffect.js'

describe('KzgEffect', () => {
	// Mock KZG interface for testing
	const mockBlob = Bytes.random(4096)
	const mockCommitment = Bytes.random(48)
	const mockProof = Bytes.random(48)

	const mockKzg: Kzg = {
		blobToKzgCommitment: vi.fn().mockReturnValue(mockCommitment),
		computeBlobKzgProof: vi.fn().mockReturnValue(mockProof),
	}

	describe('fromEffect', () => {
		it('should create a Kzg interface from a Kzg implementation', async () => {
			const program = KzgEffectLive.fromEffect(mockKzg)
			const kzg = await Effect.runPromise(program)

			expect(kzg).toHaveProperty('blobToKzgCommitment')
			expect(kzg).toHaveProperty('computeBlobKzgProof')
		})
	})

	describe('blobToKzgCommitmentEffect', () => {
		it('should convert a blob to a KZG commitment', async () => {
			const program = KzgEffectLive.blobToKzgCommitmentEffect(mockKzg, mockBlob)
			const commitment = await Effect.runPromise(program)

			expect(commitment).toBe(mockCommitment)
			expect(mockKzg.blobToKzgCommitment).toHaveBeenCalledWith(mockBlob)
		})
	})

	describe('computeBlobKzgProofEffect', () => {
		it('should compute a KZG proof for a blob', async () => {
			const program = KzgEffectLive.computeBlobKzgProofEffect(mockKzg, mockBlob, mockCommitment)
			const proof = await Effect.runPromise(program)

			expect(proof).toBe(mockProof)
			expect(mockKzg.computeBlobKzgProof).toHaveBeenCalledWith(mockBlob, mockCommitment)
		})
	})

	describe('error handling', () => {
		it('should handle errors when KZG operations fail', async () => {
			const errorMockKzg: Kzg = {
				blobToKzgCommitment: vi.fn().mockImplementation(() => {
					throw new Error('KZG operation failed')
				}),
				computeBlobKzgProof: vi.fn().mockImplementation(() => {
					throw new Error('KZG operation failed')
				}),
			}

			const program = KzgEffectLive.blobToKzgCommitmentEffect(errorMockKzg, mockBlob)
			await expect(Effect.runPromise(program)).rejects.toThrow()
		})
	})
})
