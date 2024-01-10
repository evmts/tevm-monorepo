import type { TevmStateManagerInterface } from './TevmStateManager.js'
import { DefaultStateManager } from '@ethereumjs/statemanager'

/**
 * Custom implementation of the TevmStateManagerInterface that extends the DefaultStateManager class.
 */
export class DefaultTevmStateManager
	extends DefaultStateManager
	implements TevmStateManagerInterface
{
	/**
	 * Retrieves the addresses of all the accounts in the state.
	 * @returns An array of account addresses.
	 */
	getAccountAddresses = () => {
		const accountAddresses: string[] = []
		// Tevm initializes account cache with an ordered map cache
		this._accountCache?._orderedMapCache?.forEach((e) => {
			accountAddresses.push(e[0])
		})

		return accountAddresses
	}
}
