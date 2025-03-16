import type { StorageDump } from '@tevm/common'
import type { Hex } from 'viem'

/**
 * [Description of what this type represents]
 * @example
 * ```typescript
 * import { SerializableTevmState } from '[package-path]'
 * 
 * const value: SerializableTevmState = {
 *   // Initialize properties
 * }
 * ```
 */
export type SerializableTevmState = {
	[key: string]: {
		nonce: Hex
		balance: Hex
		storageRoot: Hex
		codeHash: Hex
		storage?: StorageDump
	}
}
