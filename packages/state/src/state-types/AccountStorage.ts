import type { StorageDump } from '@tevm/common'
import type { Hex } from 'viem'

export interface AccountStorage {
	nonce: bigint
	balance: bigint
	storageRoot: Hex
	codeHash: Hex
	deployedBytecode?: Hex
	storage?: StorageDump
}
