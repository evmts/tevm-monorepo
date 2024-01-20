import type { StorageDump } from '@ethereumjs/common'
import type { Hex } from 'viem'

interface AccountStorage {
	nonce: bigint
	balance: bigint
	storageRoot: Hex
	codeHash: Hex
	storage?: StorageDump
}

export type SerializableTevmState = {
	[key: string]: AccountStorage
}

interface ParameterizedAccountStorage {
	nonce: Hex
	balance: Hex
	storageRoot: Hex
	codeHash: Hex
	storage?: StorageDump
}

// API friendly version of SerializableTevmState with bigints and uint8arrays replaced with hex strings
export type ParameterizedTevmState = {
	[key: string]: ParameterizedAccountStorage
}
