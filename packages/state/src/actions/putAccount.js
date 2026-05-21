/**
 * Saves an account into state under the provided `address`.
 * @type {import("../state-types/index.js").StateAction<'putAccount'>}
 */
export const putAccount = (baseState) => async (address, account) => {
	if (account !== undefined) {
		baseState.tombstones.accounts.delete(address.toString())
		baseState.caches.accounts?.put(address, /** @type {any} */ (account))
	} else {
		baseState.tombstones.accounts.add(address.toString())
		baseState.caches.accounts?.put(address, undefined)
	}
}
