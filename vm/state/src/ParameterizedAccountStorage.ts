import type { StorageDump } from '@ethereumjs/common'
import type { Hex } from 'viem'

export interface ParameterizedAccountStorage {
	nonce: Hex
	balance: Hex
	storageRoot: Hex
	codeHash: Hex
	storage?: StorageDump
}
