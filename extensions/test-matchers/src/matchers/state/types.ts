import type { GetAccountResult } from '@tevm/actions'
import type { Hex } from '@tevm/utils'

export type ExpectedState = Partial<Omit<GetAccountResult, 'address' | 'errors'>>

export interface StorageEntry {
	slot: Hex
	value: Hex
}

export type ExpectedStorage = StorageEntry | StorageEntry[]
