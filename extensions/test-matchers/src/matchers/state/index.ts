import type { TevmNode } from '@tevm/node'
import type { Client } from 'viem'
import { toBeInitializedAccount } from './toBeInitializedAccount.js'
import { toHaveState } from './toHaveState.js'
import { toHaveStorageAt } from './toHaveStorageAt.js'
import type { ExpectedState, ExpectedStorage } from './types.js'

export { toBeInitializedAccount, toHaveState, toHaveStorageAt }

export interface StateMatchers {
	toBeInitializedAccount(client: Client | TevmNode): Promise<void>
	toHaveState(client: Client | TevmNode, expectedState: ExpectedState): Promise<void>
	toHaveStorageAt(client: Client | TevmNode, expectedStorage: ExpectedStorage): Promise<void>
}
