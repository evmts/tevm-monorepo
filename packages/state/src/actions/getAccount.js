import { fromRlpSerializedAccount } from '../utils/accountHelpers.js'
import { getAccountFromProvider } from './getAccountFromProvider.js'

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
		// Cast AddressInterface to EthjsAddress for internal cache operations
		const addr = /** @type {import('@tevm/utils').EthjsAddress} */ (address)
		const {
			caches: { accounts },
			forkCache: { accounts: forkAccounts },
		} = baseState

		// First check main cache
		const elem = accounts.get(addr)
		if (elem !== undefined) {
			return elem.accountRLP !== undefined ? fromRlpSerializedAccount(elem.accountRLP) : undefined
		}

		// Then check fork cache if we have a fork
		if (baseState.options.fork?.transport) {
			const forkElem = forkAccounts.get(addr)
			if (forkElem !== undefined) {
				// Convert to account and update main cache with value from fork cache
				if (forkElem.accountRLP !== undefined) {
					const account = fromRlpSerializedAccount(forkElem.accountRLP)
					accounts.put(addr, account)
					baseState.logger.debug({ address: addr }, 'Retrieved account from fork cache')
					return account
				}
				// Handle undefined account case
				accounts.put(addr, undefined)
				baseState.logger.debug({ address: addr }, 'Retrieved empty account from fork cache')
				return undefined
			}
		}

		if (!baseState.options.fork?.transport) {
			return undefined
		}

		if (skipFetchingFromFork) {
			return undefined
		}

		baseState.logger.debug({ address: addr }, 'fetching account from remote RPC')
		const account = await getAccountFromProvider(baseState)(addr)

		if (
			account.nonce === 0n &&
			account.balance === 0n &&
			account.codeHash.every((/** @type {number} */ d) => d === 0) &&
			account.storageRoot.every((/** @type {number} */ d) => d === 0)
		) {
			// Store empty account in both caches
			accounts.put(addr, undefined)
			forkAccounts.put(addr, undefined)
			return undefined
		}

		// Store in both caches
		accounts.put(addr, account)
		forkAccounts.put(addr, account)

		baseState.logger.debug({ address: addr, account }, 'Cached forked account in state manager and fork cache')
		return account
	}
