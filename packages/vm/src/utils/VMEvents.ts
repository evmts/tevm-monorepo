import type { Block } from '@tevm/block'
import type { TypedTransaction } from '@tevm/tx'
import type { AfterTxEvent } from './AfterTxEvent.js'
import type { AfterBlockEvent } from './AfterblockEvent.js'

export type VMEvents = {
	beforeBlock: (data: Block, resolve?: (result?: any) => void) => void
	afterBlock: (data: AfterBlockEvent, resolve?: (result?: any) => void) => void
	beforeTx: (data: TypedTransaction, resolve?: (result?: any) => void) => void
	afterTx: (data: AfterTxEvent, resolve?: (result?: any) => void) => void
}
