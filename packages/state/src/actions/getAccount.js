import { EthjsAccount } from '@tevm/utils'
import { getAccountFromProvider } from './getAccountFromProvider.js'

/**
 * Gets the code corresponding to the provided `address`.
 * @type {import("../state-types/index.js").StateAction<'getAccount'>}
 */
export const getAccount = (baseState) => async (address) => {
	const {
		caches: { accounts },
	} = baseState
	const elem = accounts.get(address)
	if (elem !== undefined) {
		return elem.accountRLP !== undefined ? EthjsAccount.fromRlpSerializedAccount(elem.accountRLP) : undefined
	}
	if (!baseState.options.fork?.url && elem === undefined) {
		return undefined
	}
	baseState.logger.debug({ address }, 'fetching account from remote RPC')
	const account = await getAccountFromProvider(baseState)(
		/** @type {import('@tevm/utils').Address}*/ (address.toString()),
	)
	if (
		account.nonce === 0n &&
		account.balance === 0n &&
		account.codeHash.every((d) => d === 0) &&
		account.storageRoot.every((d) => d === 0)
	) {
		return undefined
	}
	accounts.put(address, account)
	baseState.logger.debug({ address, account }, 'Cached forked account in state manager')
	return account
}
