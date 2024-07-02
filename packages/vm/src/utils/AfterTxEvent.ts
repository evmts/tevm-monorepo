import type { TypedTransaction } from '@tevm/tx'
import type { RunTxResult } from './RunTxResult.js'

export interface AfterTxEvent extends RunTxResult {
	/**
	 * The transaction which just got finished
	 */
	transaction: TypedTransaction
}
