/**
 * Options for sealing a block.
 */
export interface SealBlockOpts {
	/**
	 * For PoW, the nonce.
	 * Overrides the value passed in the constructor.
	 */
	nonce?: Uint8Array

	/**
	 * For PoW, the mixHash.
	 * Overrides the value passed in the constructor.
	 */
	mixHash?: Uint8Array
}
