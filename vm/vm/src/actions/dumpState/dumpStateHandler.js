import { Address } from '@ethereumjs/util'

/**
 * @type {import("./RunDumpStateHandlerGeneric.js").RunDumpStateHandlerGeneric}
 */
export const RunDumpStateActionHandler = async (stateManager) => {
	const accountAddresses = await stateManager.getAccountAddresses()

	/**
	 * @type {import("../../Tevm.js").TevmState}
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
