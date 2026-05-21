import { keccak256 } from '@tevm/utils'
import { bytesToHex } from 'viem'

/**
 * Returns a mock kzg object that always trusts never verifies
 * The real kzg commitmenet is over 500kb added to bundle size
 * so this is useful explicit opt-in alternative for smaller bundles
 * @returns {import("./MockKzg.js").MockKzg}
 * @throws {never}
 * @example
 * ```typescript
 * import { createCommon, createMockKzg, mainnet } from 'tevm/common'
 *
 * const common = createCommon({
 *   ...mainnet,
 *   customCrypto: {
 *     kzg: createMockKzg(),
 *   },
 * })
 * ```
 * @see [createCommon](https://tevm.sh/reference/tevm/common/functions/createcommon/)
 */
export const createMockKzg = () => {
	const mockHash = bytesToHex(keccak256('0x69', 'bytes'))
	const mockBytes48 = `${mockHash}${mockHash.slice(2, 34)}`
	return {
		loadTrustedSetup: () => 69,
		verifyKzgProof: () => true,
		freeTrustedSetup: () => {},
		verifyBlobKzgProof: () => true,
		blobToKzgCommitment: () => mockBytes48,
		computeBlobKzgProof: () => mockBytes48,
		verifyBlobKzgProofBatch: () => true,
		// New methods required by the updated KZG interface
		computeBlobProof: () => mockBytes48,
		verifyProof: () => true,
		verifyBlobProofBatch: () => true,
		computeCells: () => [mockBytes48],
		computeCellsAndProofs: () => [[mockBytes48], [mockBytes48]],
		recoverCellsAndProofs: () => [[mockBytes48], [mockBytes48]],
		verifyCellKzgProofBatch: () => true,
	}
}
