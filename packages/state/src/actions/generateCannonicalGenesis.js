import { AccountCache, CacheType, StorageCache } from '@ethereumjs/statemanager'
import { createAddress } from '@tevm/address'
import { InternalError } from '@tevm/errors'
import { createAccount, hexToBytes, isHex } from '@tevm/utils'
import { ContractCache } from '../ContractCache.js'
import { putContractStorage } from './putContractStorage.js'

/**
 * Loads a {@link TevmState} into the state manager
 * @type {import("../state-types/index.js").StateAction<'generateCanonicalGenesis'>}
 */
export const generateCanonicalGenesis = (baseState) => async (state) => {
	if (
		baseState.caches.accounts._checkpoints > 0 ||
		baseState.caches.storage._checkpoints > 0 ||
		baseState.caches.contracts._checkpoints > 0
	) {
		throw new InternalError('Attempted to generateCanonicalGenesis state with uncommitted checkpoints')
	}
	const { caches: oldCaches } = baseState
	baseState.caches = {
		contracts: new ContractCache(),
		accounts: new AccountCache({
			size: 100_000,
			type: CacheType.LRU,
		}),
		storage: new StorageCache({
			size: 100_000,
			type: CacheType.LRU,
		}),
	}
	try {
		for (const [k, v] of Object.entries(/** @type {import('../state-types/TevmState.js').TevmState}*/ (state))) {
			const { nonce, balance, storageRoot, codeHash, storage, deployedBytecode } = v
			const account = createAccount({
				nonce,
				balance,
				storageRoot: hexToBytes(storageRoot, { size: 32 }),
				codeHash: hexToBytes(codeHash, { size: 32 }),
			})
			const address = createAddress(k)

			baseState.caches.accounts?.put(address, account)
			if (deployedBytecode) {
				baseState.caches.contracts.put(address, hexToBytes(deployedBytecode))
			}
			if (storage !== undefined) {
				for (const [storageKey, storageData] of Object.entries(storage)) {
					const key = hexToBytes(isHex(storageKey) ? storageKey : `0x${storageKey}`)
					const data = /** @type {Uint8Array}*/ (hexToBytes(isHex(storageData) ? storageData : `0x${storageData}`))
					await putContractStorage(baseState)(address, key, data)
				}
			}
		}
	} catch (e) {
		baseState.logger.debug(state)
		baseState.logger.error(e, 'There was an error generating cannonical genesis. Reverting back to old state')
		baseState.caches = oldCaches
		throw e
	}
}
