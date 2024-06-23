import { describe, expect, it } from 'bun:test'
import { keccak256 } from '@tevm/utils'
import { createMockKzg } from './createMockKzg.js'

describe('createMockKzg', () => {
	it('should return an object with the correct methods', () => {
		const mockKzg = createMockKzg()

		expect(mockKzg).toHaveProperty('loadTrustedSetup')
		expect(mockKzg).toHaveProperty('verifyKzgProof')
		expect(mockKzg).toHaveProperty('freeTrustedSetup')
		expect(mockKzg).toHaveProperty('verifyBlobKzgProof')
		expect(mockKzg).toHaveProperty('blobToKzgCommitment')
		expect(mockKzg).toHaveProperty('computeBlobKzgProof')
		expect(mockKzg).toHaveProperty('verifyBlobKzgProofBatch')
	})

	it('should return 69 from loadTrustedSetup', () => {
		const mockKzg = createMockKzg()
		expect(mockKzg.loadTrustedSetup()).toBe(69)
	})

	it('should return true from verifyKzgProof', () => {
		const mockKzg = createMockKzg()
		// @ts-expect-error
		expect(mockKzg.verifyKzgProof()).toBe(true)
	})

	it('should not throw from freeTrustedSetup', () => {
		const mockKzg = createMockKzg()
		expect(() => mockKzg.freeTrustedSetup()).not.toThrow()
	})

	it('should return true from verifyBlobKzgProof', () => {
		const mockKzg = createMockKzg()
		// @ts-expect-error
		expect(mockKzg.verifyBlobKzgProof()).toBe(true)
	})

	it('should return keccak256 hash from blobToKzgCommitment', () => {
		const mockKzg = createMockKzg()
		// @ts-expect-error
		expect(mockKzg.blobToKzgCommitment()).toBe(keccak256('0x69', 'bytes'))
	})

	it('should return keccak256 hash from computeBlobKzgProof', () => {
		const mockKzg = createMockKzg()
		// @ts-expect-error
		expect(mockKzg.computeBlobKzgProof()).toBe(keccak256('0x69', 'bytes'))
	})

	it('should return true from verifyBlobKzgProofBatch', () => {
		const mockKzg = createMockKzg()
		// @ts-expect-error
		expect(mockKzg.verifyBlobKzgProofBatch()).toBe(true)
	})
})
