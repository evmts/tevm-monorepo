import { MissingAccountError } from './ethSignHandler.js'

/**
 * @param {object} options
 * @param {ReadonlyArray<import('@tevm/utils').HDAccount>} options.accounts
 * @param {() => Promise<number>} options.getChainId
 * @returns {import('./EthHandler.js').EthSignTransactionHandler}
 */
export const ethSignTransactionHandler = ({ getChainId, accounts }) => {
	const accountsByAddress = Object.fromEntries(accounts.map((account) => [account.address, account]))

	return async ({ nonce, ...params }) => {
		// TODO validate params with @tevm/zod
		const account = accountsByAddress[params.from]
		if (!account) {
			throw new MissingAccountError(`Account ${params.from} not found`)
		}
		return account.signTransaction({
			...params,
			type: 'eip2930',
			chainId: Number(await getChainId()),
			...(typeof nonce === 'bigint' ? { nonce: Number(nonce) } : {}),
		})
	}
}
