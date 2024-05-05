/**
 * Saves an account into state under the provided `address`.
 * @type {import("../state-types/index.js").StateAction<'putAccount'>}
 */
export const putAccount = (baseState) => async (address, account) => {
	if (account !== undefined) {
		baseState._caches.accounts?.put(address, account)
	} else {
		baseState._caches.accounts?.del(address)
	}
}
