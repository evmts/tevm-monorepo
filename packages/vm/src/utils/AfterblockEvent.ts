import type { Block } from '@tevm/block'
import type { RunBlockResult } from './RunBlockResult.js'

/**
 * [Description of what this interface represents]
 * @example
 * ```typescript
 * import { AfterBlockEvent } from '[package-path]'
 * 
 * const value: AfterBlockEvent = {
 *   // Initialize properties
 * }
 * ```
 */
export interface AfterBlockEvent extends RunBlockResult {
	// The block which just finished processing
	block: Block
}
