// [mozilla public license 2.0](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/LICENSE)
import type { SerializableTevmState } from './SerializableTevmState.js'
import type { TevmStateManagerInterface } from './TevmStateManagerInterface.js'
import { CacheType, DefaultStateManager } from '@ethereumjs/statemanager'
import { EthjsAccount, EthjsAddress } from '@tevm/utils'
import {
	type Address,
	type Hex,
	bytesToHex,
	fromRlp,
	hexToBytes,
	isHex,
} from 'viem'

/**
 * The ethereum state manager implementation for running Tevm in `normal` mode.
 * Normal mode does not fork/proxy to a external RPC url and has no unique features
 * Internally this state manager gets used when no proxy or fork url is passed into Tevm client
 * @see ForkStateManager for a provider that uses forks state rather than always using latest state
 * @see ProxyStateManager for a provider that uses latest state rather than creating a fork
 */
export class NormalStateManager
	extends DefaultStateManager
	implements TevmStateManagerInterface
{
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
	 * Returns a new instance of the ForkStateManager with the same opts and all storage copied over
	 */
	async deepCopy(): Promise<NormalStateManager> {
		const newState = new NormalStateManager({
			codeCacheOpts: { type: CacheType.ORDERED_MAP },
			accountCacheOpts: { type: CacheType.ORDERED_MAP },
			storageCacheOpts: { type: CacheType.ORDERED_MAP },
			common: this.common,
			trie: this._trie.shallowCopy(false, { cacheSize: 0 }),
			prefixStorageTrieKeys: this._prefixStorageTrieKeys,
			prefixCodeHashes: this._prefixCodeHashes,
		})

		await Promise.all(
			this.getAccountAddresses().map(async (address) => {
				const ethjsAddress = EthjsAddress.fromString(`0x${address}`)

				const [account, code] = await Promise.all([
					this.getAccount(ethjsAddress),
					this.getContractCode(ethjsAddress),
				])

				if (account === undefined) {
					return
				}

				await newState.putAccount(ethjsAddress, account)

				if (code.length === 0) {
					return
				}
				await newState.putContractCode(ethjsAddress, code)

				const storage = await this.dumpStorage(ethjsAddress)

				await Promise.all(
					Object.entries(storage).map(async ([key, value]) => {
						await newState.putContractStorage(
							ethjsAddress,
							hexToBytes(key as Hex),
							hexToBytes(value as Hex),
						)
					}),
				)
			}),
		)

		await newState.checkpoint()
		await newState.commit()

		return newState
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
		return out
	}

	/**
	 * Loads a {@link SerializableTevmState} into the state manager
	 */
	override generateCanonicalGenesis = async (
		state: SerializableTevmState,
	): Promise<void> => {
		for (const [k, v] of Object.entries(state)) {
			const { nonce, balance, storageRoot, codeHash, storage } = v
			const account = new EthjsAccount(
				// replace with just the var
				nonce,
				balance,
				hexToBytes(storageRoot, { size: 32 }),
				hexToBytes(codeHash, { size: 32 }),
			)
			const address = EthjsAddress.fromString(k)
			this.putAccount(address, account)
			if (storage !== undefined) {
				for (const [storageKey, storageData] of Object.entries(storage)) {
					const key = hexToBytes(
						isHex(storageKey) ? storageKey : `0x${storageKey}`,
					)
					const encodedStorageData = fromRlp(
						isHex(storageData) ? storageData : `0x${storageData}`,
					)
					const data = hexToBytes(
						isHex(encodedStorageData)
							? encodedStorageData
							: `0x${encodedStorageData}`,
					)
					this.putContractStorage(address, key, data)
				}
			}
		}
	}

	/**
	 * Dumps the state of the state manager as a {@link SerializableTevmState}
	 */
	dumpCanonicalGenesis = async (): Promise<SerializableTevmState> => {
		const accountAddresses: string[] = []
		this._accountCache?._orderedMapCache?.forEach((e) => {
			accountAddresses.push(e[0])
		})

		const state: SerializableTevmState = {}

		for (const address of accountAddresses) {
			const hexAddress = `0x${address}`
			const account = await this.getAccount(EthjsAddress.fromString(hexAddress))

			if (account !== undefined) {
				const storage = await this.dumpStorage(
					EthjsAddress.fromString(hexAddress),
				)

				state[hexAddress] = {
					...account,
					storageRoot: bytesToHex(account.storageRoot),
					codeHash: bytesToHex(account.codeHash),
					storage,
				}
			}
		}

		return state
	}
}
