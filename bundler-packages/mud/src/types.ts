import type { Address, Chain, Client, Transport } from 'viem'
import type { SmartAccount } from 'viem/account-abstraction'

export type SessionClient = Client<Transport, Chain, SmartAccount> & {
	readonly userAddress: Address
}
