import type { StorageDump } from '@tevm/common'
import type { Hex } from 'viem'

/**
 * [Description of what this interface represents]
 * @example
 * ```typescript
 * import { AccountStorage } from '[package-path]'
 * 
 * const value: AccountStorage = {
 *   // Initialize properties
 * }
 * ```
 */
export interface AccountStorage {
	nonce: bigint
	balance: bigint
	storageRoot: Hex
	codeHash: Hex
	deployedBytecode?: Hex
	storage?: StorageDump
}
