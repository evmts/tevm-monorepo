import type { Block } from '@tevm/block'
import type { TypedTransaction } from '@tevm/tx'
import type { AfterBlockEvent } from './AfterblockEvent.js'
import type { AfterTxEvent } from './AfterTxEvent.js'

/**
 * Event handlers for the VM execution lifecycle.
 * Allows subscribing to events before and after block/transaction processing.
 * @example
 * ```typescript
 * import { VMEvents } from '@tevm/vm'
 * import { VM } from '@tevm/vm'
 *
 * const vm = new VM()
 *
 * // Add event handlers
 * const handlers: Partial<VMEvents> = {
 *   beforeBlock: (block) => {
 *     console.log(`Processing block ${block.header.number}`)
 *   },
 *   afterTx: (data) => {
 *     console.log(`Transaction executed with status: ${data.execResult.exceptionError ? 'failed' : 'success'}`)
 *   }
 * }
 *
 * // Register handlers
 * Object.entries(handlers).forEach(([event, handler]) => {
 *   vm.events.on(event, handler)
 * })
 * ```
 */
export type VMEvents = {
	beforeBlock: (data: Block, resolve?: (result?: any) => void) => void
	afterBlock: (data: AfterBlockEvent, resolve?: (result?: any) => void) => void
	beforeTx: (data: TypedTransaction, resolve?: (result?: any) => void) => void
	afterTx: (data: AfterTxEvent, resolve?: (result?: any) => void) => void
}
