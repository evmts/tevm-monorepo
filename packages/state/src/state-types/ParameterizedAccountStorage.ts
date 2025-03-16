// [mozilla public license 2.0](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/LICENSE)
import type { StorageDump } from '@tevm/common'
import type { Hex } from 'viem'

/**
 * [Description of what this interface represents]
 * @example
 * ```typescript
 * import { ParameterizedAccountStorage } from '[package-path]'
 * 
 * const value: ParameterizedAccountStorage = {
 *   // Initialize properties
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
