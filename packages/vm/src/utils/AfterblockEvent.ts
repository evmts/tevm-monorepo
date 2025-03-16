import type { Block } from '@tevm/block'
import type { RunBlockResult } from './RunBlockResult.js'

/**
 * Event data emitted after a block has been processed.
 * Extends RunBlockResult with the block that was processed.
 * @example
 * ```typescript
 * import { AfterBlockEvent } from '@tevm/vm'
 * import { VM } from '@tevm/vm'
 *
 * // Access in VM event handlers
 * const vm = new VM()
 * vm.events.on('afterBlock', (event: AfterBlockEvent) => {
 *   console.log('Block processed:', event.block.header.number)
 *   console.log('Receipts:', event.receipts)
 * })
 * ```
 */
export interface AfterBlockEvent extends RunBlockResult {
	// The block which just finished processing
	block: Block
}
