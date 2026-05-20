import { clearContractStorage } from './clearContractStorage.js'

/**
 * Deletes an account from state under the provided `address`.
 * @type {import("../state-types/index.js").StateAction<'deleteAccount'>}
 */
export const deleteAccount = (baseState) => async (address) => {
	await baseState.ready()
	baseState.tombstones.accounts.add(address.toString())
	await clearContractStorage(baseState)(address)
	baseState.caches.accounts.put(address, undefined)
	baseState.caches.contracts.put(address, new Uint8Array())
	baseState.logger.debug({ address }, 'Deleted account')
	return
}
