// TODO move this to errors package
export class MissingAccountError extends Error {
	/**
	 * @type {'MissingAccountError'}
	 */
	_tag = 'MissingAccountError'
	/**
	 * @type {'MissingAccountError'}
	 * @override
	 */
	name = 'MissingAccountError'
}

/**
 * @param {{accounts: ReadonlyArray<import('@tevm/utils').HDAccount>}} params
 * @returns {import('@tevm/actions-types').EthSignHandler}
 */
export const ethSignHandler = ({ accounts }) => {
	const accountsByAddress = Object.fromEntries(
		accounts.map((account) => [account.address, account]),
	)

	return async (params) => {
		// TODO validate params with @tevm/zod
		const account = accountsByAddress[params.address]
		if (!account) {
			throw new MissingAccountError(`Account ${params.address} not found`)
		}
		return account.signMessage({ message: params.data })
	}
}
