import type { StorageDump } from '@ethereumjs/common'

interface AccountStorage {
	nonce: bigint
	balance: bigint
	storageRoot: Uint8Array
	codeHash: Uint8Array
	storage?: StorageDump
}

export type SerializableTevmState = {
	[key: string]: AccountStorage
}
