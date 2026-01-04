/**
 * Dump of storage entries for an account.
 * Maps storage key hashes to storage values.
 *
 * @example
 * ```typescript
 * import type { StorageDump } from '@tevm/common'
 *
 * const dump: StorageDump = {
 *   '0x0000...0001': '0x0000...0064', // slot 1 = 100
 *   '0x0000...0002': '0x0000...00c8', // slot 2 = 200
 * }
 * ```
 */
export interface StorageDump {
	[key: string]: string
}
