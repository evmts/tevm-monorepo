import type { TevmStateManagerInterface } from './TevmStateManagerInterface.js'
import { DefaultStateManager } from '@ethereumjs/statemanager'

/**
 * The ethereum state manager implementation for running Tevm in `normal` mode.
 * Normal mode does not fork/proxy to a external RPC url and has no unique features
 * Internally this state manager gets used when no proxy or fork url is passed into Tevm client
 * @see ForkStateManager for a provider that uses forks state rather than always using latest state
 * @see ProxyStateManager for a provider that uses latest state rather than creating a fork
 */
export class NormalStateManager
	extends DefaultStateManager
	implements TevmStateManagerInterface {
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
