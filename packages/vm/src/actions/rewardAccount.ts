import type { EvmType as Evm } from '@tevm/evm'
import { EthjsAccount, EthjsAddress } from '@tevm/utils'

export async function rewardAccount(evm: Evm, address: EthjsAddress, reward: bigint): Promise<EthjsAccount> {
	let account = (await evm.stateManager.getAccount(address)) as EthjsAccount | undefined
	if (account === undefined) {
		account = new EthjsAccount()
	}
	account.balance += reward
	await evm.journal.putAccount(address, account as any)

	return account
}
