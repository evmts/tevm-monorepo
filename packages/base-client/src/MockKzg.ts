export type MockKzg = {
	loadTrustedSetup: (trustedSetup?: any) => number
	freeTrustedSetup: () => void
	blobToKzgCommitment: (blob: Uint8Array) => Uint8Array
	computeBlobKzgProof: (blob: Uint8Array, commitment: Uint8Array) => Uint8Array
	verifyBlobKzgProofBatch: (blobs: Uint8Array[], commitments: Uint8Array[], proofs: Uint8Array[]) => boolean
	verifyKzgProof: (commitment: Uint8Array, z: Uint8Array, y: Uint8Array, proof: Uint8Array) => boolean
	verifyBlobKzgProof: (blob: Uint8Array, commitment: Uint8Array, proof: Uint8Array) => boolean
}
