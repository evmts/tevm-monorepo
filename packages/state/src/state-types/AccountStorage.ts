import type { StorageDump } from '@tevm/common'
import type { Hex } from 'viem'

/**
 * Represents an Ethereum account storage with native bigint values.
 * Used for internal state management and account manipulation.
 * @example
 * ```typescript
 * import { AccountStorage } from '@tevm/state'
 *
 * const value: AccountStorage = {
 *   nonce: 0n,
 *   balance: 10000000000000000000n, // 10 ETH
 *   storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
 *   codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
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
