import { MissingAccountError } from './ethSignHandler.js'

/**
 * Creates a handler for the `eth_signTransaction` JSON-RPC method.
 * Signs but does not broadcast a transaction. The chain ID is resolved lazily.
 *
 * @param {object} options
 * @param {ReadonlyArray<import('@tevm/utils').HDAccount>} options.accounts
 * @param {() => Promise<number>} options.getChainId
 * @returns {import('./EthHandler.js').EthSignTransactionHandler}
 * @throws {MissingAccountError} If `from` is not found in `accounts`.
 */
export const ethSignTransactionHandler = ({ getChainId, accounts }) => {
	const accountsByAddress = Object.fromEntries(accounts.map((account) => [account.address, account]))

	return async ({ nonce, ...params }) => {
		// TODO validate params with zod
		const account = accountsByAddress[params.from]
		if (!account) {
			throw new MissingAccountError(`Account ${params.from} not found`)
		}
		const txType = params.type
			? params.type
			: params.maxFeePerBlobGas || params.blobVersionedHashes
				? 'eip4844'
				: params.authorizationList
					? 'eip7702'
					: params.maxFeePerGas || params.maxPriorityFeePerGas
						? 'eip1559'
						: params.accessList
							? 'eip2930'
							: 'legacy'
		return account.signTransaction(
			/** @type {any} */ ({
				...params,
				type: txType,
				chainId: Number(await getChainId()),
				...(typeof nonce === 'bigint' ? { nonce: Number(nonce) } : {}),
			}),
		)
	}
}
