import { createError } from './createError.js'
import { Address } from '@ethereumjs/util'
import { bytesToHex } from 'viem'
/**
 * @param {import("@ethereumjs/vm").VM} vm
 * @returns {import('@tevm/actions-types').DumpStateHandler}
 */
export const dumpStateHandler = (vm) => async () => {
	// can remove this as any once we start using the wrapped Vm package
	const accountAddresses =
		/** @type {import('@tevm/state').NormalStateManager}*/ (
			vm.stateManager
		).getAccountAddresses()

	/**
	 * @type {import('@tevm/state').SerializableTevmState}
	 */
	const state = {}

	try {
		for (const address of accountAddresses) {
			const hexAddress = `0x${address}`
			const account = await vm.stateManager.getAccount(
				Address.fromString(hexAddress),
			)

			if (account !== undefined) {
				const storage = await vm.stateManager.dumpStorage(
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
