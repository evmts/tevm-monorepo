// TODO improve the trusted setup type
// @see https://github.com/paulmillr/trusted-setups/tree/main
// @see wait for https://github.com/ethereumjs/ethereumjs-monorepo/issues/3662
/**
 * The interface of the custom crypto for kzg implemented by `createMockKzg``
 * The real kzg commitmenet is over 500kb added to bundle size
 * so this is useful alternative for smaller bundles and the default
 * @example
 * ```typescript
 * import { createCommon, createMockKzg, mainnet, type MockKzg } from 'tevm/common'
 *
 * const kzg: MockKzg = createMockKzg()
 *
 * const common = createCommon({
 *   ...mainnet,
 *   customCrypto: {
 *     kzg:,
 *   },
 * })
 * ```
 * @see [createMockKzg](https://tevm.sh/reference/tevm/common/functions/createmockkzg/)
 * @see [createCommon](https://tevm.sh/reference/tevm/common/functions/createcommon/)
 */
export type MockKzg = {
	loadTrustedSetup: (trustedSetup?: any) => number
	freeTrustedSetup: () => void
	blobToKzgCommitment: (blob: string) => string
	computeBlobKzgProof: (blob: string, commitment: string) => string
	verifyBlobKzgProofBatch: (blobs: string[], commitments: string[], proofs: string[]) => boolean
	verifyKzgProof: (commitment: string, z: string, y: string, proof: string) => boolean
	verifyBlobKzgProof: (blob: string, commitment: string, proof: string) => boolean
	// New methods required by ethereumjs v10
	computeBlobProof: (blob: string, commitment: string) => string
	verifyProof: (commitment: string, z: string, y: string, proof: string) => boolean
	verifyBlobProofBatch: (blobs: string[], commitments: string[], proofs: string[]) => boolean
}
