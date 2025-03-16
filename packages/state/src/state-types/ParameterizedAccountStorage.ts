// [mozilla public license 2.0](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/LICENSE)
import type { StorageDump } from '@tevm/common'
import type { Hex } from 'viem'

/**
 * Represents an Ethereum account storage with hexadecimal string values.
 * Used to serialize account data for storage and RPC responses.
 * @example
 * ```typescript
 * import { ParameterizedAccountStorage } from '@tevm/state'
 *
 * const value: ParameterizedAccountStorage = {
 *   nonce: '0x0',
 *   balance: '0x1a784379d99db42000000',
 *   storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
 *   codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
 * }
 * ```
 */
export interface ParameterizedAccountStorage {
	nonce: Hex
	balance: Hex
	storageRoot: Hex
	codeHash: Hex
	storage?: StorageDump
}
