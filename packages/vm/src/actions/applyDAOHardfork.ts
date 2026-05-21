import type { EvmType as Evm } from '@tevm/evm'
import { EthjsAccount, EthjsAddress, type Hex, hexToBytes } from '@tevm/utils'
import { DAOConfig } from './DAOConfig.js'

/**
 * Apply the DAO fork changes to the VM
 */
export async function applyDAOHardfork(evm: Evm) {
	const state = evm.stateManager

	/* DAO account list */
	const DAOAccountList = DAOConfig.DAOAccounts
	const DAORefundContract = DAOConfig.DAORefundContract

	const DAORefundContractAddress = new EthjsAddress(hexToBytes(`0x${DAORefundContract}`))
	if ((await state.getAccount(DAORefundContractAddress)) === undefined) {
		await evm.journal.putAccount(DAORefundContractAddress, new EthjsAccount() as any)
	}
	let DAORefundAccount = (await state.getAccount(DAORefundContractAddress)) as EthjsAccount | undefined
	if (DAORefundAccount === undefined) {
		DAORefundAccount = new EthjsAccount()
	}

	for (const addr of DAOAccountList) {
		// retrieve the account and add it to the DAO's Refund accounts' balance.
		const address = new EthjsAddress(hexToBytes(addr as Hex))
		let account = (await state.getAccount(address)) as EthjsAccount | undefined
		if (account === undefined) {
			account = new EthjsAccount()
		}
		DAORefundAccount.balance += account.balance
		// clear the accounts' balance
		account.balance = 0n
		await evm.journal.putAccount(address, account as any)
	}

	// finally, put the Refund Account
	await evm.journal.putAccount(DAORefundContractAddress, DAORefundAccount as any)
}
