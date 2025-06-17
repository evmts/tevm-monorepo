import type { TevmNode } from '@tevm/node'
import type { Client } from 'viem'
import { toBeInitializedAccount } from './toBeInitializedAccount.js'
import { toHaveState } from './toHaveState.js'
import type { ExpectedState } from './types.js'

export { toBeInitializedAccount, toHaveState }

export interface StateMatchers {
	toBeInitializedAccount(client: Client | TevmNode): Promise<void>
	toHaveState(client: Client | TevmNode, expectedState: ExpectedState): Promise<void>
}
