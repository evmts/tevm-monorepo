import type { Address } from 'viem'
import type { TevmStateManagerInterface } from './TevmStateManagerInterface.js'
import { CacheType, DefaultStateManager } from '@ethereumjs/statemanager'
import { Account, Address as EthjsAddress } from '@ethereumjs/util'

/**
 * The ethereum state manager implementation for running Tevm in `normal` mode.
 * Normal mode does not fork/proxy to a external RPC url and has no unique features
 * Internally this state manager gets used when no proxy or fork url is passed into Tevm client
 * @see ForkStateManager for a provider that uses forks state rather than always using latest state
 * @see ProxyStateManager for a provider that uses latest state rather than creating a fork
 */
export class NormalStateManager
	extends DefaultStateManager
	implements TevmStateManagerInterface {
	/**
	 * Retrieves the addresses of all the accounts in the state.
	 * @returns An array of account addresses.
	 */
	getAccountAddresses = (): Array<Address> => {
		const accountAddresses: Address[] = []
		// Tevm initializes account cache with an ordered map cache
		this._accountCache?._orderedMapCache?.forEach((e) => {
			accountAddresses.push(e[0] as Address)
		})

		return accountAddresses
	}

	/**
	 * Returns a new instance of the ForkStateManager with the same opts
	 */
	override shallowCopy(downlevelCaches: boolean): NormalStateManager {
		const common = this.common.copy()
		common.setHardfork(this.common.hardfork())

		const cacheSize = !downlevelCaches ? this._trie['_opts']['cacheSize'] : 0
		const trie = this._trie.shallowCopy(false, { cacheSize })
		const prefixCodeHashes = this._prefixCodeHashes
		const prefixStorageTrieKeys = this._prefixStorageTrieKeys
		let accountCacheOpts = { ...this._accountCacheSettings }
		if (downlevelCaches && !this._accountCacheSettings.deactivate) {
			accountCacheOpts = { ...accountCacheOpts, type: CacheType.ORDERED_MAP }
		}
		let storageCacheOpts = { ...this._storageCacheSettings }
		if (downlevelCaches && !this._storageCacheSettings.deactivate) {
			storageCacheOpts = { ...storageCacheOpts, type: CacheType.ORDERED_MAP }
		}
		let codeCacheOpts = { ...this._codeCacheSettings }
		if (!this._codeCacheSettings.deactivate) {
			codeCacheOpts = { ...codeCacheOpts, type: CacheType.ORDERED_MAP }
		}

		const out = new NormalStateManager({
			common,
			trie,
			prefixStorageTrieKeys,
			prefixCodeHashes,
			accountCacheOpts,
			storageCacheOpts,
			codeCacheOpts,
		})

		for (const address of this.getAccountAddresses()) {
			const ethjsAddress = EthjsAddress.fromString('0x' + address)
			const elem = this._accountCache!.get(ethjsAddress)
			// elem should never be undefined
			if (elem !== undefined) {
				const account = elem.accountRLP !== undefined
					? Account.fromRlpSerializedAccount(elem.accountRLP)
					: undefined
				out.putAccount(ethjsAddress, account)
			}
		}

		return out
	}
}
