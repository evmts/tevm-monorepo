import type { StorageDump } from '@tevm/common'
import type { Hex } from 'viem'

/**
 * A serializable representation of Ethereum state with hex string values.
 * Used for persistence, transfer, or JSON serialization of state data.
 * @example
 * ```typescript
 * import { SerializableTevmState } from '@tevm/state'
 *
 * const value: SerializableTevmState = {
 *   '0x1234567890123456789012345678901234567890': {
 *     nonce: '0x0',
 *     balance: '0x1a784379d99db42000000',
 *     storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
 *     codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
 *   }
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
