import { fromRlpSerializedAccount } from '../utils/accountHelpers.js'
import { getAccountFromProvider } from './getAccountFromProvider.js'
import { resolveForkBlockTag } from './resolveForkBlockTag.js'

/**
 * Gets the account corresponding to the provided `address`.
 * Returns undefined if account does not exist.
 *
 * When running in fork mode:
 * 1. First checks main cache for the account
 * 2. Then checks fork cache if main cache misses
 * 3. Finally fetches from remote provider if neither cache has the account
 * 4. When fetched from remote, stores in both main and fork caches
 *
 * @type {import("../state-types/index.js").StateAction<'getAccount'>}
 */
export const getAccount =
	(baseState, skipFetchingFromFork = false) =>
	async (address) => {
		const {
			caches: { accounts },
			forkCache: { accounts: forkAccounts },
		} = baseState

		if (baseState.tombstones.accounts.has(address.toString())) {
			return undefined
		}

		// First check main cache
		const elem = accounts.get(address)
		if (elem !== undefined) {
			return /** @type {any} */ (elem.accountRLP !== undefined ? fromRlpSerializedAccount(elem.accountRLP) : undefined)
		}

		// Then check fork cache if we have a fork
		if (baseState.options.fork?.transport) {
			const forkElem = forkAccounts.get(address)
			if (forkElem !== undefined) {
				// Convert to account and update main cache with value from fork cache
				if (forkElem.accountRLP !== undefined) {
					const account = fromRlpSerializedAccount(forkElem.accountRLP)
					accounts.put(address, /** @type {any} */ (account))
					baseState.logger.debug({ address }, 'Retrieved account from fork cache')
					return /** @type {any} */ (account)
				}
				// Handle undefined account case
				accounts.put(address, undefined)
				baseState.logger.debug({ address }, 'Retrieved empty account from fork cache')
				return undefined
			}
		}

		if (!baseState.options.fork?.transport) {
			return undefined
		}

		if (skipFetchingFromFork) {
			return undefined
		}

		await resolveForkBlockTag(baseState)
		baseState.logger.debug({ address }, 'fetching account from remote RPC')
		const account = await getAccountFromProvider(baseState)(address)

		if (
			account.nonce === 0n &&
			account.balance === 0n &&
			account.codeHash.every((/** @type {number} */ d) => d === 0) &&
			account.storageRoot.every((/** @type {number} */ d) => d === 0)
		) {
			// Store empty account in both caches
			accounts.put(address, undefined)
			forkAccounts.put(address, undefined)
			return undefined
		}

		// Store in both caches
		accounts.put(address, /** @type {any} */ (account))
		forkAccounts.put(address, /** @type {any} */ (account))

		baseState.logger.debug({ address, account }, 'Cached forked account in state manager and fork cache')
		return /** @type {any} */ (account)
	}
