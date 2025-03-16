import type { Address } from '@tevm/utils'
import type { AccountStorage } from './AccountStorage.js'

/**
 * A map of Ethereum addresses to their account storage data.
 * Represents the entire state of an Ethereum network at a given point.
 * @example
 * ```typescript
 * import { TevmState } from '@tevm/state'
 *
 * const value: TevmState = {
 *   '0x1234567890123456789012345678901234567890': {
 *     nonce: 0n,
 *     balance: 10000000000000000000n,
 *     storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
 *     codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
 *   }
 * }
 * ```
 */
export type TevmState = {
	[key: Address]: AccountStorage
}
