/**
 * Custom cryptographic function types for the CustomCrypto interface.
 */

/**
 * KZG commitment scheme interface for blob transactions.
 * Supports both Uint8Array (native) and string (hex) formats for compatibility
 * with different implementations including MockKzg.
 */
export interface KZG {
	loadTrustedSetup(filePath?: string | unknown): void | number
	freeTrustedSetup?(): void
	blobToKzgCommitment(blob: Uint8Array | string): Uint8Array | string
	computeBlobKzgProof(blob: Uint8Array | string, commitment: Uint8Array | string): Uint8Array | string
	verifyKzgProof(
		commitment: Uint8Array | string,
		z: Uint8Array | string,
		y: Uint8Array | string,
		proof: Uint8Array | string,
	): boolean
	verifyBlobKzgProofBatch(
		blobs: (Uint8Array | string)[],
		commitments: (Uint8Array | string)[],
		proofs: (Uint8Array | string)[],
	): boolean
	verifyBlobKzgProof?(blob: Uint8Array | string, commitment: Uint8Array | string, proof: Uint8Array | string): boolean
	// New methods required by ethereumjs v10
	computeBlobProof?(blob: Uint8Array | string, commitment: Uint8Array | string): Uint8Array | string
	verifyProof?(
		commitment: Uint8Array | string,
		z: Uint8Array | string,
		y: Uint8Array | string,
		proof: Uint8Array | string,
	): boolean
	verifyBlobProofBatch?(
		blobs: (Uint8Array | string)[],
		commitments: (Uint8Array | string)[],
		proofs: (Uint8Array | string)[],
	): boolean
}

/**
 * Verkle cryptographic operations interface.
 */
export interface VerkleCrypto {
	updateCommitment(commitment: Uint8Array, index: number, oldValue: Uint8Array, newValue: Uint8Array): Uint8Array
	getTreeKey(address: Uint8Array, treeIndex: Uint8Array, subIndex: number): Uint8Array
	getTreeKeyHash(address: Uint8Array, treeIndex: Uint8Array): Uint8Array
	hashCommitment(commitment: Uint8Array): Uint8Array
	serializeCommitment(commitment: Uint8Array): Uint8Array
	zeroCommitment: Uint8Array
}

/**
 * Interface for providing custom cryptographic primitives in place of `ethereum-cryptography` variants.
 * This allows replacing core crypto functions with alternative implementations (e.g., WASM for performance).
 *
 * @example
 * ```typescript
 * import type { CustomCrypto } from '@tevm/common'
 * import { keccak256 as wasmKeccak256 } from 'some-wasm-crypto-lib'
 *
 * const customCrypto: CustomCrypto = {
 *   keccak256: wasmKeccak256,
 * }
 * ```
 */
export interface CustomCrypto {
	/**
	 * Custom keccak256 hash function
	 */
	keccak256?: (msg: Uint8Array) => Uint8Array
	/**
	 * Custom ecrecover function to recover public key from signature
	 */
	ecrecover?: (msgHash: Uint8Array, v: bigint, r: Uint8Array, s: Uint8Array, chainId?: bigint) => Uint8Array
	/**
	 * Custom SHA256 hash function
	 */
	sha256?: (msg: Uint8Array) => Uint8Array
	/**
	 * Custom ECDSA sign function
	 */
	ecsign?: (
		msg: Uint8Array,
		pk: Uint8Array,
		ecSignOpts?: {
			extraEntropy?: Uint8Array | boolean
		},
	) => { recovery: number; r: bigint; s: bigint }
	/**
	 * Custom ECDSA recover function
	 */
	ecdsaRecover?: (sig: Uint8Array, recId: number, hash: Uint8Array) => Uint8Array
	/**
	 * KZG commitment scheme for blob transactions
	 */
	kzg?: KZG
	/**
	 * Verkle tree cryptographic operations
	 */
	verkle?: VerkleCrypto
}
