/**
 * Native Proof types for EIP-1186 account/storage proofs.
 * These types replace @ethereumjs/statemanager's Proof types with a more minimal dependency footprint.
 *
 * @see {@link https://eips.ethereum.org/EIPS/eip-1186 | EIP-1186: RPC-Method to get Merkle Proofs}
 */

import type { PrefixedHexString } from './common-types.js'

/**
 * Storage proof for a single storage slot.
 * Part of an EIP-1186 proof response.
 */
export type StorageProof = {
	/** Storage slot key (32 bytes, hex-encoded). */
	key: PrefixedHexString
	/** Merkle proof for the storage slot (array of RLP-encoded trie nodes). */
	proof: PrefixedHexString[]
	/** Storage value (hex-encoded). */
	value: PrefixedHexString
}

/**
 * EIP-1186 account and storage proof.
 * Returned by eth_getProof RPC method.
 */
export type Proof = {
	/** Account address (20 bytes, hex-encoded with 0x prefix). */
	address: PrefixedHexString
	/** Account balance (hex-encoded). */
	balance: PrefixedHexString
	/** Account code hash (32 bytes, hex-encoded). */
	codeHash: PrefixedHexString
	/** Account nonce (hex-encoded). */
	nonce: PrefixedHexString
	/** Account storage root hash (32 bytes, hex-encoded). */
	storageHash: PrefixedHexString
	/** Merkle proof for the account (array of RLP-encoded trie nodes). */
	accountProof: PrefixedHexString[]
	/** Storage proofs for requested storage slots. */
	storageProof: StorageProof[]
}
