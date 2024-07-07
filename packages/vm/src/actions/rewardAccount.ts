import { EthjsAccount, EthjsAddress } from '@tevm/utils'

import type { Evm } from '@tevm/evm'

export async function rewardAccount(evm: Evm, address: EthjsAddress, reward: bigint): Promise<EthjsAccount> {
	let account = await evm.stateManager.getAccount(address)
	if (account === undefined) {
		account = new EthjsAccount()
	}
	account.balance += reward
	await evm.journal.putAccount(address, account)

	return account
}
