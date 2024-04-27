/**
 * Saves an account into state under the provided `address`.
 * @type {import("../state-types/index.js").StateAction<'putAccount'>}
 */
export const putAccount =
	({ _caches: { accounts } }) =>
	async (address, account) => {
		if (account !== undefined) {
			accounts?.put(address, account)
		} else {
			accounts?.del(address)
		}
	}
