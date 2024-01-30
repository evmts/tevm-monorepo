/**
 * @param {ReadonlyArray<import('viem').Account>} accounts
 * @returns {import('@tevm/actions-types').EthAccountsHandler}
 */
export const ethAccountsHandler = (accounts) => async () => {
	return accounts.map((account) => account.address)
}
