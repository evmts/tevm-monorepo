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
	console.log(
		'lrucache',
		storage._orderedMapCache?.size(),
		'storageMap',
		address.toString(),
		storageMap,
		'storageKey',
		storage.get(address, new Uint8Array(32)),
		'elementByKey',
		storage._orderedMapCache?.getElementByKey(address.toString().slice(2)),
	)
	if (storageMap !== undefined) {
		for (const slot of storageMap) {
			console.log('looping slot', slot[0], bytesToHex(slot[1]))
			dump[slot[0]] = bytesToHex(slot[1])
		}
	}
	console.log('returning dump', dump)
	return Promise.resolve(dump)
}
