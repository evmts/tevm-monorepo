import { InternalError } from '@tevm/errors'
import { bytesToHex, hexToBytes } from 'viem'
import { getAccount } from './getAccount.js'
import { getForkBlockTag } from './getForkBlockTag.js'
import { getForkClient } from './getForkClient.js'
import { putContractStorage } from './putContractStorage.js'

/**
 * Gets the storage value associated with the provided `address` and `key`. This method returns
 * the shortest representation of the stored value.
 * corresponding to the provided address at the provided key.
 * If this does not exist an empty `Uint8Array` is returned.
 *
 * When running in fork mode:
 * 1. First checks main cache for the value
 * 2. Then checks fork cache if main cache misses
 * 3. Finally fetches from remote provider if neither cache has the value
 * 4. When fetched from remote, stores in both main and fork caches
 *
 * @param {import('../BaseState.js').BaseState} baseState
 * @returns {(address: import('@tevm/utils').EthjsAddress, key: Uint8Array) => Promise<Uint8Array>}
 */
export const getContractStorage = (baseState) => async (address, key) => {
	const {
		caches: { storage: storageCache },
		forkCache: { storage: forkStorageCache },
	} = baseState
	// Check storage slot in cache
	if (key.length !== 32) {
		throw new InternalError(
			`Storage key must be 32 bytes long. Received ${key.length}. If using numberToHex make the length 32.`,
		)
	}

	// First check main cache
	const cachedValue = storageCache.get(address, key)
	if (cachedValue !== undefined) {
		return cachedValue
	}

	// Then check fork cache if we have a fork
	if (baseState.options.fork?.transport) {
		const forkedValue = forkStorageCache.get(address, key)
		if (forkedValue !== undefined) {
			// Also update main cache with value from fork cache
			await putContractStorage(baseState)(address, key, forkedValue)
			baseState.logger.debug({ address, key, forkedValue }, 'Retrieved storage from fork cache')
			return forkedValue
		}
	}

	const isContractAtAddress = (await getAccount(baseState)(address))?.isContract()
	if (!isContractAtAddress) {
		baseState.logger.debug(`No contract found at address ${address}. Cannot getContractStorage if there is no contract`)
		return hexToBytes('0x0')
	}

	if (!baseState.options.fork?.transport) {
		return hexToBytes('0x0')
	}

	baseState.logger.debug({ address, key }, 'Fetching storage from remote RPC')

	const client = getForkClient(baseState)
	const blockTag = getForkBlockTag(baseState)

	const storage = await client.getStorageAt({
		address: /** @type {import('@tevm/utils').Address} */ (address.toString()),
		slot: bytesToHex(key),
		...blockTag,
	})
	const value = hexToBytes(storage ?? '0x0')

	// Store in both caches
	await putContractStorage(baseState)(address, key, value)

	// Also store in fork cache to persist original values
	forkStorageCache.put(address, key, value)

	baseState.logger.debug({ address, key, value }, 'Cached forked storage to state and fork cache')

	return value
}
