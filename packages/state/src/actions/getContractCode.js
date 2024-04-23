import { hexToBytes } from 'viem'
import { getForkBlockTag } from './getForkBlockTag.js'
import { getForkClient } from './getForkClient.js'

/**
 * Gets the code corresponding to the provided `address`.
 * Returns an empty `Uint8Array` if the account has no associated code.
 * @type {import("../state-types/index.js").StateAction<'getContractCode'>}
 */
export const getContractCode = (baseState) => async (address) => {
	const {
		_options,
		_caches: { contracts },
	} = baseState

	const codeBytes = contracts.get(address)

	if (codeBytes !== undefined) {
		return codeBytes
	}

	if (!_options.fork?.url) {
		return new Uint8Array(0)
	}

	const client = getForkClient(baseState)
	const blockTag = getForkBlockTag(baseState)

	const remoteCode = await client.getBytecode({
		address: /** @type {import('@tevm/utils').Address}*/ (address.toString()),
		...blockTag,
	})

	if (!remoteCode) {
		return new Uint8Array(0)
	}

	const remoteCodeBytes = hexToBytes(remoteCode)

	contracts.put(address, remoteCodeBytes)

	return remoteCodeBytes
}
