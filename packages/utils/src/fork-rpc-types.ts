import type { Hex } from './hex-types.js'

/**
 * Storage proof entry returned by eth_getProof
 */
export type StorageProofEntry = {
	key: Hex
	value: Hex
	proof: Hex[]
}

/**
 * Result of eth_getProof RPC call
 */
export type ProofResult = {
	/** The address of the account */
	address: Hex
	/** Account balance */
	balance: bigint
	/** Account nonce */
	nonce: bigint
	/** Hash of the account code */
	codeHash: Hex
	/** Root hash of the account's storage trie */
	storageHash: Hex
	/** Array of rlp-encoded MerkleTree-Nodes, starting with the stateRoot-Node */
	accountProof: Hex[]
	/** Array of storage-entries as requested */
	storageProof: StorageProofEntry[]
}

/**
 * Fork RPC client interface providing viem-compatible methods.
 * Used internally by state package for fetching data from forked chain.
 */
export type ForkRpcClient = {
	/**
	 * Get contract bytecode at an address
	 * @param params - Address and optional block identifier
	 * @returns Contract bytecode or undefined if no code
	 */
	getBytecode: (params: {
		address: Hex
		blockNumber?: bigint
		blockTag?: string
	}) => Promise<Hex | undefined>

	/**
	 * Get storage value at a slot
	 * @param params - Address, slot, and optional block identifier
	 * @returns Storage value as hex
	 */
	getStorageAt: (params: {
		address: Hex
		slot: Hex
		blockNumber?: bigint
		blockTag?: string
	}) => Promise<Hex>

	/**
	 * Get account proof including storage proofs
	 * @param params - Address, storage keys, and optional block identifier
	 * @returns Account and storage proofs
	 */
	getProof: (params: {
		address: Hex
		storageKeys: Hex[]
		blockNumber?: bigint
		blockTag?: string
	}) => Promise<ProofResult>
}
