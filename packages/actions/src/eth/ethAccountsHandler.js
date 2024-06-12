/**
 * @param {{accounts: ReadonlyArray<import('@tevm/utils').Account>}} params
 * @returns {import('./EthHandler.js').EthAccountsHandler}
 */
export const ethAccountsHandler =
	({ accounts }) =>
	async () => {
		return accounts.map((account) => account.address)
	}
