import { bytesToHex } from 'viem'

/**
 * Dumps the RLP-encoded storage values for an `account` specified by `address`.
 * Keys are the storage keys, values are the storage values as strings.
 * Both are represented as `0x` prefixed hex strings.
 * @type {import("../state-types/index.js").StateAction<'dumpStorage'>}
 */
export const dumpStorage = (vm) => (address) => {
	const {
		caches: { storage },
	} = vm
	const storageMap = storage.dump(address)
	/**
	 * @type {import("@tevm/common").StorageDump}
	 */
	const dump = {}
	if (storageMap !== undefined) {
		for (const slot of storageMap) {
			dump[slot[0]] = bytesToHex(slot[1])
		}
	}
	return Promise.resolve(dump)
}
