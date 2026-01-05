/**
 * Object that can contain a set of storage keys associated with an account.
 * Used for debug_storageRangeAt RPC method.
 *
 * @example
 * ```typescript
 * import type { StorageRange } from '@tevm/common'
 *
 * const range: StorageRange = {
 *   storage: {
 *     '0xabc...': { key: '0x0', value: '0x64' }
 *   },
 *   nextKey: '0xdef...'
 * }
 * ```
 */
export interface StorageRange {
	/**
	 * A dictionary where the keys are hashed storage keys, and the values are
	 * objects containing the preimage of the hashed key (in `key`) and the
	 * storage key (in `value`). Currently, there is no way to retrieve preimages,
	 * so they are always `null`.
	 */
	storage: {
		[key: string]: {
			key: string | null
			value: string
		}
	}
	/**
	 * The next (hashed) storage key after the greatest storage key
	 * contained in `storage`.
	 */
	nextKey: string | null
}
