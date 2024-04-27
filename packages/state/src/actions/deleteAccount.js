/**
 * Deletes an account from state under the provided `address`.
 * @type {import("../state-types/index.js").StateAction<'deleteAccount'>}
 */
export const deleteAccount = (baseState) => (address) => {
	baseState._caches.accounts.del(address)
	return Promise.resolve()
}
