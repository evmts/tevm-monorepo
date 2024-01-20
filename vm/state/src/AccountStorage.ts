import type { StorageDump } from '@ethereumjs/common'
import type { Hex } from 'viem'

export interface AccountStorage {
	nonce: bigint
	balance: bigint
	storageRoot: Hex
	codeHash: Hex
	storage?: StorageDump
}
