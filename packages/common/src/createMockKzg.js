import { keccak256 } from '@tevm/utils'

/**
 * Returns a mock kzg object that always trusts never verifies
 * The real kzg commitmenet is over 500kb added to bundle size
 * so this is useful alternative for smaller bundles and the default
 * @returns {Required<import("@ethereumjs/common").CustomCrypto>['kzg']}
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
	return {
		verifyProof: () => true,
		blobToKzgCommitment: () => keccak256('0x69'),
		computeBlobProof: () => keccak256('0x69'),
		verifyBlobProofBatch: () => true,
	}
}
