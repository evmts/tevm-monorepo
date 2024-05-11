/**
 * Saves an account into state under the provided `address`.
 * @type {import("../state-types/index.js").StateAction<'putAccount'>}
 */
export const putAccount = (baseState) => async (address, account) => {
	if (account !== undefined) {
		baseState.caches.accounts?.put(address, account)
	} else {
		baseState.caches.accounts?.del(address)
	}
}
