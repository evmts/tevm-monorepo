import type { Block } from '@tevm/block'
import type { TypedTransaction } from '@tevm/tx'
import { type Hex } from '@tevm/utils'
import type { GetFilterLogsReturnType } from 'viem'

export type FilterType = 'PendingTransaction' | 'Block' | 'Log'

type TODO = any

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
* Criteria of the logs
* https://github.com/ethereum/go-ethereum/blob/master/eth/filters/filter_system.go#L329
*/
logsCriteria?: TODO
/**
* Stores logs
*/
logs: Array<GetFilterLogsReturnType[number]>
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
/**
* Listeners registered for the filter
*/
registeredListeners: Array<(...args: Array<any>) => any>
}
