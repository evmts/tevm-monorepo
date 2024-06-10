/**
 * @param {{accounts: ReadonlyArray<import('@tevm/utils').Account>}} params
 * @returns {import('@tevm/actions').EthAccountsHandler}
 */
export const ethAccountsHandler =
	({ accounts }) =>
	async () => {
		return accounts.map((account) => account.address)
	}
