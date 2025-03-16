import type { Address } from '@tevm/utils'
import type { AccountStorage } from './AccountStorage.js'

/**
 * [Description of what this type represents]
 * @example
 * ```typescript
 * import { TevmState } from '[package-path]'
 * 
 * const value: TevmState = {
 *   // Initialize properties
 * }
 * ```
 */
export type TevmState = {
	[key: Address]: AccountStorage
}
