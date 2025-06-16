import type { Client } from 'viem'
import { toBeInitializedAccount } from './toBeInitializedAccount.js'
import type { TevmNode } from '@tevm/node'

export { toBeInitializedAccount }

export interface StateMatchers {
	toBeInitializedAccount(client: Client | TevmNode): Promise<void>
}
