// TODO improve the trusted setup type
// @see https://github.com/paulmillr/trusted-setups/tree/main
/**
 * The interface of the custom crypto for KZG implemented by `createMockKzg`.
 * The real KZG commitment implementation can add significant bundle size,
 * so this is a useful explicit opt-in alternative for smaller bundles.
 * @example
 * ```typescript
 * import { createCommon, createMockKzg, mainnet, type MockKzg } from 'tevm/common'
 *
 * const kzg: MockKzg = createMockKzg()
 *
 * const common = createCommon({
 *   ...mainnet,
 *   customCrypto: {
 *     kzg,
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
	// Newer KZG method aliases required by the EVM runtime.
	computeBlobProof: (blob: string, commitment: string) => string
	verifyProof: (commitment: string, z: string, y: string, proof: string) => boolean
	verifyBlobProofBatch: (blobs: string[], commitments: string[], proofs: string[]) => boolean
	computeCells: (blob: string) => string[]
	computeCellsAndProofs: (blob: string) => [string[], string[]]
	recoverCellsAndProofs: (indices: number[], cells: string[]) => [string[], string[]]
	verifyCellKzgProofBatch: (commitments: string[], indices: number[], cells: string[], proofs: string[]) => boolean
}
