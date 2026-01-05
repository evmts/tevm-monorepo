import type { Address } from '@tevm/utils'
import type { Chain, Client, Transport, WriteContractParameters, WriteContractReturnType } from 'viem'
import type { BundlerClient, SmartAccount } from 'viem/account-abstraction'

export type SessionClient = BundlerClient<Transport, Chain, SmartAccount, Client> & {
	readonly userAddress: Address
	writeContract: (args: WriteContractParameters) => Promise<WriteContractReturnType>
}
