import { bytesToHex } from '@tevm/utils'
import { hexToBytes } from 'viem'
import { getForkBlockTag } from './getForkBlockTag.js'
import { getForkClient } from './getForkClient.js'

const EMPTY_CODE = Object.freeze(new Uint8Array())

/**
 * Gets the code corresponding to the provided `address`.
 * Returns an empty `Uint8Array` if the account has no associated code.
 * @type {import("../state-types/index.js").StateAction<'getContractCode'>}
 */
export const getContractCode =
	(baseState, skipFetchingFromFork = false) =>
	async (address) => {
		const {
			options,
			caches: { contracts },
		} = baseState

		const codeBytes = contracts.get(address)

		if (codeBytes !== undefined) {
			return codeBytes
		}

		if (!options.fork?.transport) {
			return EMPTY_CODE
		}

		if (skipFetchingFromFork) {
			return EMPTY_CODE
		}

		baseState.logger.debug({ address }, 'Fetching contract code from remote RPC...')

		const client = getForkClient(baseState)
		const blockTag = getForkBlockTag(baseState)

		// don't fetch if we cached empty code already
		if (contracts.has(address)) {
			return EMPTY_CODE
		}

		const remoteCode = await client.getBytecode({
			address: /** @type {import('@tevm/utils').Address}*/ (address.toString()),
			...blockTag,
		})

		if (!remoteCode) {
			baseState.logger.debug({ address }, 'No remote code found')
			contracts.put(address, EMPTY_CODE)
			return EMPTY_CODE
		}

		const remoteCodeBytes = hexToBytes(remoteCode)

		contracts.put(address, remoteCodeBytes)

		baseState.logger.debug(
			{ address, deployedBytecode: bytesToHex(remoteCodeBytes) },
			'Cached forked contract bytecode to state',
		)

		return remoteCodeBytes
	}
