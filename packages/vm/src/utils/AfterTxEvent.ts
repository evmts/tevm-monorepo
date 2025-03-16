import type { TypedTransaction } from '@tevm/tx'
import type { RunTxResult } from './RunTxResult.js'

/**
 * Event data emitted after a transaction has been executed.
 * Extends RunTxResult with the transaction that triggered the event.
 * @example
 * ```typescript
 * import { AfterTxEvent } from '@tevm/vm'
 * import { VM } from '@tevm/vm'
 *
 * // Access in VM event handlers
 * const vm = new VM()
 * vm.events.on('afterTx', (event: AfterTxEvent) => {
 *   console.log('Transaction executed:', event.transaction)
 *   console.log('Gas used:', event.gasUsed)
 * })
 * ```
 */
export interface AfterTxEvent extends RunTxResult {
	/**
	 * The transaction which just got finished
	 */
	transaction: TypedTransaction
}
