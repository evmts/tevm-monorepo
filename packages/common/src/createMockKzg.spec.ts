import { describe, expect, it } from 'vitest'
import { createMockKzg } from './createMockKzg.js'

describe('createMockKzg', () => {
	it('should return an object with the correct methods', () => {
		const mockKzg = createMockKzg()

		expect(mockKzg).toHaveProperty('verifyProof')
		expect(mockKzg).toHaveProperty('blobToKzgCommitment')
		expect(mockKzg).toHaveProperty('computeBlobProof')
		expect(mockKzg).toHaveProperty('verifyBlobProofBatch')
	})

	it('should return true from verifyProof', () => {
		const mockKzg = createMockKzg()
		// @ts-expect-error
		expect(mockKzg.verifyProof()).toBe(true)
	})

	it('should return keccak256 hash from blobToKzgCommitment', () => {
		const mockKzg = createMockKzg()
		// @ts-expect-error
		expect(mockKzg.blobToKzgCommitment()).toMatchSnapshot()
	})

	it('should return keccak256 hash from computeBlobProof', () => {
		const mockKzg = createMockKzg()
		// @ts-expect-error
		expect(mockKzg.computeBlobProof()).toMatchSnapshot()
	})

	it('should return true from verifyBlobProofBatch', () => {
		const mockKzg = createMockKzg()
		// @ts-expect-error
		expect(mockKzg.verifyBlobProofBatch()).toBe(true)
	})
})
