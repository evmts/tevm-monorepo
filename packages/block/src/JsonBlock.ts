import type { JsonTx } from '@tevm/tx'
import type { Hex, JsonRpcWithdrawal } from '@tevm/utils'
import type { VerkleExecutionWitness } from './VerkleExecutionWitness.js'
import type { JsonHeader } from './JsonHeader.js'

/**
 * An object with the block's data represented as strings.
 */
export interface JsonBlock {
	/**
	 * Header data for the block
	 */
	header?: JsonHeader
	transactions?: JsonTx[]
	uncleHeaders?: JsonHeader[]
	withdrawals?: JsonRpcWithdrawal[]
	requests?: Hex[] | null
	executionWitness?: VerkleExecutionWitness | null
}
