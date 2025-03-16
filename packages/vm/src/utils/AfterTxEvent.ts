import type { TypedTransaction } from '@tevm/tx'
import type { RunTxResult } from './RunTxResult.js'

/**
 * [Description of what this interface represents]
 * @example
 * ```typescript
 * import { AfterTxEvent } from '[package-path]'
 * 
 * const value: AfterTxEvent = {
 *   // Initialize properties
 * }
 * ```
 */
export interface AfterTxEvent extends RunTxResult {
	/**
	 * The transaction which just got finished
	 */
	transaction: TypedTransaction
}
