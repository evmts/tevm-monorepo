import type { AccountStorage } from './AccountStorage.js'

export type SerializableTevmState = {
	[key: string]: AccountStorage
}
