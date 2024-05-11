/**
 * Deletes an account from state under the provided `address`.
 * @type {import("../state-types/index.js").StateAction<'deleteAccount'>}
 */
export const deleteAccount = (baseState) => (address) => {
	baseState.caches.accounts.del(address)
	// TODO known bug for unused api. we should delete bytecode too
	baseState.logger.debug({ address }, 'Deleted account')
	return Promise.resolve()
}
