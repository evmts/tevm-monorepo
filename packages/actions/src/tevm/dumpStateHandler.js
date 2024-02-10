import { createError } from './createError.js'
import { Address } from '@ethereumjs/util'
import { bytesToHex } from 'viem'
/**
 * @param {import("@tevm/state").NormalStateManager | import("@tevm/state").ForkStateManager | import("@tevm/state").ProxyStateManager} stateManager
 * @returns {import('@tevm/actions-types').DumpStateHandler}
 */
export const dumpStateHandler = (stateManager) => async () => {
	const accountAddresses = stateManager.getAccountAddresses()

	/**
	 * @type {import('@tevm/state').SerializableTevmState}
	 */
	const state = {}

	try {
		for (const address of accountAddresses) {
			const hexAddress = `0x${address}`
			const account = await stateManager.getAccount(
				Address.fromString(hexAddress),
			)

			if (account !== undefined) {
				const storage = await stateManager.dumpStorage(
					Address.fromString(hexAddress),
				)

				state[hexAddress] = {
					...account,
					storageRoot: bytesToHex(account.storageRoot),
					codeHash: bytesToHex(account.codeHash),
					storage,
				}
			}
		}
	} catch (e) {
		return {
			state,
			errors: [
				createError(
					'UnexpectedError',
					typeof e === 'string'
						? e
						: e instanceof Error
							? e.message
							: 'unknown error',
				),
			],
		}
	}

	return {
		state,
	}
}
