import { keccak256 } from '@tevm/utils'

/**
 * @returns {import("./MockKzg.js").MockKzg}
 */
export const createMockKzg = () => {
	return {
		loadTrustedSetup: () => 69,
		verifyKzgProof: () => true,
		freeTrustedSetup: () => {},
		verifyBlobKzgProof: () => true,
		blobToKzgCommitment: () => keccak256('0x69', 'bytes'),
		computeBlobKzgProof: () => keccak256('0x69', 'bytes'),
		verifyBlobKzgProofBatch: () => true,
	}
}
