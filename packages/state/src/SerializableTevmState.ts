import type { StorageDump } from '@tevm/common'
import type { Hex } from 'viem'

export type SerializableTevmState = {
	[key: string]: {
		nonce: Hex
		balance: Hex
		storageRoot: Hex
		codeHash: Hex
		storage?: StorageDump
	}
}
