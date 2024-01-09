import type { TevmStateManagerInterface } from './TevmStateManager.js'
import { DefaultStateManager } from '@ethereumjs/statemanager'

export class DefaultTevmStateManager
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
}
