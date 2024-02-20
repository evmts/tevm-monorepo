import type { AccountStorage } from './AccountStorage.js'

export type TevmState = {
	[key: string]: AccountStorage
}
