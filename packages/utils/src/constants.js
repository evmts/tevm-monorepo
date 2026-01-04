/**
 * Ethereum-related constants migrated from @ethereumjs/util
 * These are now native implementations with no external dependencies.
 */

/**
 * Conversion factor from Gwei to Wei (1 Gwei = 10^9 Wei)
 * @type {bigint}
 */
export const GWEI_TO_WEI = 1000000000n

/**
 * BigInt zero constant for use in Ethereum calculations
 * @type {bigint}
 */
export const BIGINT_0 = 0n

/**
 * BigInt one constant for use in Ethereum calculations
 * @type {bigint}
 */
export const BIGINT_1 = 1n

/**
 * Maximum value for a 64-bit unsigned integer (2^64 - 1)
 * @type {bigint}
 */
export const MAX_UINT64 = 18446744073709551615n

/**
 * Half of the secp256k1 curve order.
 * Used for signature malleability checks (s-value must be in lower half of curve order).
 * secp256k1 curve order n = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141
 * This is n / 2 (rounded down).
 * @type {bigint}
 */
export const SECP256K1_ORDER_DIV_2 = 57896044618658097711785492504343953926418782139537452191302581570759080747168n

/**
 * Keccak-256 hash of the RLP encoding of an empty string/null (0x80)
 * This is used as the empty trie root hash in Ethereum.
 *
 * Computed as: keccak256(RLP(Uint8Array(0))) = keccak256([0x80])
 *
 * @type {`0x${string}`}
 * @example
 * ```javascript
 * import { KECCAK256_RLP } from '@tevm/utils'
 *
 * // Use as empty trie root
 * const emptyTrieRoot = KECCAK256_RLP
 * // '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421'
 * ```
 */
export const KECCAK256_RLP = /** @type {`0x${string}`} */ ('0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421')

/**
 * Keccak-256 hash of the RLP encoding of an empty array (0xc0)
 * This is used as the empty uncles hash in Ethereum block headers.
 *
 * Computed as: keccak256(RLP([])) = keccak256([0xc0])
 *
 * @type {`0x${string}`}
 * @example
 * ```javascript
 * import { KECCAK256_RLP_ARRAY } from '@tevm/utils'
 *
 * // Use as empty uncles hash
 * const emptyUnclesHash = KECCAK256_RLP_ARRAY
 * // '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347'
 * ```
 */
export const KECCAK256_RLP_ARRAY = /** @type {`0x${string}`} */ ('0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347')

/**
 * Keccak-256 hash of an empty string/null bytes.
 * This is used as the code hash for accounts with no code (EOAs).
 *
 * Computed as: keccak256(Uint8Array(0)) = keccak256([])
 *
 * @type {`0x${string}`}
 * @example
 * ```javascript
 * import { KECCAK256_NULL } from '@tevm/utils'
 *
 * // Use as empty code hash for EOA accounts
 * const emptyCodeHash = KECCAK256_NULL
 * // '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
 * ```
 */
export const KECCAK256_NULL = /** @type {`0x${string}`} */ ('0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470')

/**
 * Keccak-256 hash of RLP([]) as bytes (empty storage root).
 * @type {Uint8Array}
 */
export const KECCAK256_RLP_BYTES = new Uint8Array([
	86, 232, 31, 23, 27, 204, 85, 166,
	255, 131, 69, 230, 146, 192, 248, 110,
	91, 72, 224, 27, 153, 108, 173, 192,
	1, 98, 47, 181, 227, 99, 180, 33
])

/**
 * Keccak-256 hash of RLP([[]]) as bytes (empty uncles hash).
 * This is the keccak256 of RLP encoding an empty array of arrays.
 * @type {Uint8Array}
 */
export const KECCAK256_RLP_ARRAY_BYTES = new Uint8Array([
	29, 204, 77, 232, 222, 199, 93, 122,
	171, 133, 181, 103, 182, 204, 212, 26,
	211, 18, 69, 27, 148, 138, 116, 19,
	240, 161, 66, 253, 64, 212, 147, 71
])

/**
 * Keccak-256 hash of empty bytes as bytes (empty code hash).
 * @type {Uint8Array}
 */
export const KECCAK256_NULL_BYTES = new Uint8Array([
	197, 210, 70, 1, 134, 247, 35, 60,
	146, 126, 125, 178, 220, 199, 3, 192,
	229, 0, 182, 83, 202, 130, 39, 59,
	123, 250, 216, 4, 93, 133, 164, 112
])
