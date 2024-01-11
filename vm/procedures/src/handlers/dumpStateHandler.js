import { Address } from '@ethereumjs/util'
import { DefaultTevmStateManager, TevmStateManager } from '@tevm/state'
/**
 * @param {TevmStateManager | DefaultTevmStateManager} stateManager
 * @returns {Promise<import('@tevm/state').SerializableTevmState>}
 */
export const runDumpStateActionHandler = async (stateManager) => {
	const accountAddresses = await stateManager.getAccountAddresses()

	/**
	 * @type {import('@tevm/state').SerializableTevmState}
	 */
	const state = {}

	for (const address of accountAddresses) {
		const hexAddress = `0x${address}`
		const account = await stateManager.getAccount(
			Address.fromString(hexAddress),
		)

		if (account !== undefined) {
			const storage = await stateManager.dumpStorage(
				Address.fromString(hexAddress),
			)

			state[hexAddress] = { ...account, storage }
		}
	}

	return state
}
