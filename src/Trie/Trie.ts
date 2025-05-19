/**
 * Ethereum Merkle Patricia Trie implementation interface
 */

/**
 * Represents a Merkle Patricia Trie
 */
export interface Trie {
  /**
   * Get a value from the trie
   * @param key - The key to look up
   * @returns The value if found, or null if not present
   */
  get(key: Uint8Array): Promise<Uint8Array | null>;

  /**
   * Insert or update a value in the trie
   * @param key - The key to insert
   * @param value - The value to insert
   * @returns Promise that resolves when the operation is complete
   */
  put(key: Uint8Array, value: Uint8Array): Promise<void>;

  /**
   * Remove a key-value pair from the trie
   * @param key - The key to remove
   * @returns Promise that resolves when the operation is complete
   */
  delete(key: Uint8Array): Promise<void>;

  /**
   * Calculate the root hash of the trie
   * @returns The root hash as a 32-byte array
   */
  rootHash(): Promise<Uint8Array>;

  /**
   * Generate a Merkle proof for a key
   * @param key - The key to generate a proof for
   * @returns The proof as an array of RLP-encoded nodes
   */
  prove(key: Uint8Array): Promise<Uint8Array[]>;

  /**
   * Verify a Merkle proof against a root hash
   * @param rootHash - The root hash to verify against
   * @param key - The key being proven
   * @param proof - The proof nodes
   * @param expectedValue - The expected value if present, or null for non-inclusion proof
   * @returns True if the proof is valid, false otherwise
   */
  verifyProof(
    rootHash: Uint8Array,
    key: Uint8Array,
    proof: Uint8Array[],
    expectedValue: Uint8Array | null
  ): Promise<boolean>;
}