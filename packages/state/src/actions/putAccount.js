/**
 * Saves an account into state under the provided `address`.
 * @type {import("../state-types/index.js").StateAction<'putAccount'>}
 */
export const putAccount = (baseState) => async (address, account) => {
	// Cast AddressInterface to EthjsAddress since the cache expects the concrete type
	const addr = /** @type {import('@tevm/utils').EthjsAddress} */ (address)
	// Cast AccountInterface to EthjsAccount since the cache expects the concrete type
	const acct = /** @type {import('@tevm/utils').EthjsAccount | undefined} */ (account)
	if (acct !== undefined) {
		baseState.caches.accounts?.put(addr, acct)
	} else {
		baseState.caches.accounts?.del(addr)
	}
}
