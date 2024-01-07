import { DefaultStateManager } from '@ethereumjs/statemanager'
import { Account, Address } from '@ethereumjs/util'
import type { TevmStateManagerInterface } from '../Tevm.js'

export class TevmStateManager
	extends DefaultStateManager
	implements TevmStateManagerInterface
{
	getAccountAddresses = () => {
		const accountAddresses: string[] = []
		//TODO check both caches?
		this._accountCache?._orderedMapCache?.forEach((e) => {
			accountAddresses.push(e[0])
		})

		return accountAddresses
	}

	putAccountData = (address: Address, accountData: Account) => {
		this._accountCache?.put(address, accountData)
	}
}
