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
	blobToKzgCommitment: (blob: Uint8Array) => Uint8Array
	computeBlobKzgProof: (blob: Uint8Array, commitment: Uint8Array) => Uint8Array
	verifyBlobKzgProofBatch: (blobs: Uint8Array[], commitments: Uint8Array[], proofs: Uint8Array[]) => boolean
	verifyKzgProof: (commitment: Uint8Array, z: Uint8Array, y: Uint8Array, proof: Uint8Array) => boolean
	verifyBlobKzgProof: (blob: Uint8Array, commitment: Uint8Array, proof: Uint8Array) => boolean
}
