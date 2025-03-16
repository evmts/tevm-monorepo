// Fixed number of extra-data prefix bytes reserved for signer vanity
/**
 * The fixed number of bytes reserved for the vanity data in Clique consensus extra data
 * In the Clique consensus algorithm, the extraData field of block headers contains:
 * - First CLIQUE_EXTRA_VANITY (32) bytes: vanity data (can be anything)
 * - Followed by signer addresses
 * - Last CLIQUE_EXTRA_SEAL (65) bytes: the signer's signature
 * 
 * @example
 * ```typescript
 * import { CLIQUE_EXTRA_VANITY } from '@tevm/block'
 * 
 * // Extract vanity data from extraData
 * const vanityData = extraData.slice(0, CLIQUE_EXTRA_VANITY)
 * ```
 */
export const CLIQUE_EXTRA_VANITY = 32
// Fixed number of extra-data suffix bytes reserved for signer seal
/**
 * The fixed number of bytes reserved for the signer's signature in Clique consensus extra data
 * In the Clique consensus algorithm, the extraData field of block headers contains:
 * - First CLIQUE_EXTRA_VANITY (32) bytes: vanity data
 * - Followed by signer addresses
 * - Last CLIQUE_EXTRA_SEAL (65) bytes: the signer's signature (secp256k1 signature)
 * 
 * @example
 * ```typescript
 * import { CLIQUE_EXTRA_SEAL, CLIQUE_EXTRA_VANITY } from '@tevm/block'
 * 
 * // Extract the signature from extraData
 * const signature = extraData.slice(extraData.length - CLIQUE_EXTRA_SEAL)
 * 
 * // Extract the list of signers from extraData (between vanity and seal)
 * const signersData = extraData.slice(CLIQUE_EXTRA_VANITY, extraData.length - CLIQUE_EXTRA_SEAL)
 * ```
 */
export const CLIQUE_EXTRA_SEAL = 65
