// this file is originally adapted from ethereumjs and thus carries the same license
import type { TransactionType, TxData } from '@tevm/tx'
import type { WithdrawalData } from '@tevm/utils'
import type { ClRequest } from './ClRequest.js'
import type { HeaderData } from './HeaderData.js'
import type { VerkleExecutionWitness } from './VerkleExecutionWitness.js'

/**
 * A block's data.
 */
export interface BlockData {
	/**
	 * Header data for the block
	 */
	header?: HeaderData
	transactions?: Array<TxData[TransactionType]>
	uncleHeaders?: Array<HeaderData>
	withdrawals?: Array<WithdrawalData>
	requests?: Array<ClRequest>
	/**
	 * EIP-6800: Verkle Proof Data (experimental)
	 */
	executionWitness?: VerkleExecutionWitness | null
}
