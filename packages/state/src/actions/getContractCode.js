import { bytesToHex } from '@tevm/utils'
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
		options,
		caches: { contracts },
	} = baseState

	const codeBytes = contracts.get(address)

	if (codeBytes !== undefined) {
		return codeBytes
	}

	if (!options.fork?.url) {
		return new Uint8Array()
	}

	baseState.logger.debug({ address }, 'Fetching contract code from remote RPC...')

	const client = getForkClient(baseState)
	const blockTag = getForkBlockTag(baseState)

	const remoteCode = await client.getBytecode({
		address: /** @type {import('@tevm/utils').Address}*/ (address.toString()),
		...blockTag,
	})

	if (!remoteCode) {
		baseState.logger.debug({ address }, 'No remote code found')
		return new Uint8Array()
	}

	const remoteCodeBytes = hexToBytes(remoteCode)

	contracts.put(address, remoteCodeBytes)

	baseState.logger.debug(
		{ address, deployedBytecode: bytesToHex(remoteCodeBytes) },
		'Cached forked contract bytecode to state',
	)

	return remoteCodeBytes
}
