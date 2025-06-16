import type { Client } from 'viem'
import { toBeInitializedAccount } from './toBeInitializedAccount.js'

export { toBeInitializedAccount }

export interface StateMatchers {
	toBeInitializedAccount(client: Client): Promise<void>
}
