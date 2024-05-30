import type { TypedTransaction } from '@tevm/tx'
import type { Block } from '@tevm/block'
import { type EthjsLog, type Hex } from '@tevm/utils'

export type FilterType = 'PendingTransaction' | 'Block' | 'Log'

// Adapted from go-ethereum/blob/master/eth/filters/filter_system.go#L359
/**
* Internal representation of a registered filter
*/
export type Filter = {
/**
* Id of the filter
*/
id: Hex
/**
* The type of the filter
*/
type: FilterType
/**
* Creation timestamp
*/
created: number
/**
* Stores logs
*/
logs: Array<EthjsLog>
/**
* stores tx
*/
tx: Array<TypedTransaction>
/**
* Stores the blocks
*/
blocks: Array<Block>
/**
* Not sure what this is yet
*/
installed: {}
/**
* Error if any
*/
err: Error | undefined
}
