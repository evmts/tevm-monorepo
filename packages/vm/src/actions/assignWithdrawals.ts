import { Block } from '@tevm/block'
import { EthjsAddress, parseGwei, Withdrawal } from '@tevm/utils'

import type { BaseVm } from '../BaseVm.js'
import { rewardAccount } from './rewardAccount.js'

export const assignWithdrawals =
	(vm: BaseVm) =>
	async (block: Block): Promise<void> => {
		const withdrawals = block.withdrawals as Withdrawal[]
		for (const withdrawal of withdrawals) {
			const { address, amount } = withdrawal
			// Withdrawal amount is represented in Gwei so needs to be
			// converted to wei
			// Note: event if amount is 0, still reward the account
			// such that the account is touched and marked for cleanup if it is empty
			await rewardAccount(vm.evm, new EthjsAddress(address), parseGwei(amount.toString()))
		}
	}
