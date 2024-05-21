import { bytesToHex, hexToBytes } from 'viem'
import { getForkBlockTag } from './getForkBlockTag.js'
import { getForkClient } from './getForkClient.js'
import { putContractStorage } from './putContractStorage.js'

/**
 * Gets the storage value associated with the provided `address` and `key`. This method returns
 * the shortest representation of the stored value.
 * corresponding to the provided address at the provided key.
 * If this does not exist an empty `Uint8Array` is returned.
 * @type {import("../state-types/index.js").StateAction<'getContractStorage'>}
 */
export const getContractStorage = (baseState) => async (address, key) => {
	const {
		caches: { storage: storageCache },
	} = baseState
	// Check storage slot in cache
	if (key.length !== 32) {
		throw new Error(
			`Storage key must be 32 bytes long. Received ${key.length}. If using numberToHex make the length 32.`,
		)
	}

	const cachedValue = storageCache.get(address, key)
	if (cachedValue !== undefined) {
		return cachedValue
	}

	if (!baseState.options.fork?.url) {
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

	await putContractStorage(baseState)(address, key, value)

	baseState.logger.debug({ address, key, value }, 'Cached forked storage to state')

	return value
}
