import type { Evm } from '@tevm/evm'
import type { AccountInterface } from '@tevm/common'
import { EthjsAccount, EthjsAddress } from '@tevm/utils'

export async function rewardAccount(evm: Evm, address: EthjsAddress, reward: bigint): Promise<AccountInterface> {
	let account = await evm.stateManager.getAccount(address)
	if (account === undefined) {
		account = new EthjsAccount()
	}
	account.balance += reward
	await evm.journal.putAccount(address, account as EthjsAccount)

	return account
}
