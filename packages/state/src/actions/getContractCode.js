import { bytesToHex } from '@tevm/utils'
import { hexToBytes } from 'viem'
import { getForkBlockTag } from './getForkBlockTag.js'
import { getForkClient } from './getForkClient.js'

const EMPTY_CODE = Object.freeze(new Uint8Array())

/**
 * Gets the code corresponding to the provided `address`.
 * Returns an empty `Uint8Array` if the account has no associated code.
 *
 * When running in fork mode:
 * 1. First checks main cache for the code
 * 2. Then checks fork cache if main cache misses
 * 3. Finally fetches from remote provider if neither cache has the code
 * 4. When fetched from remote, stores in both main and fork caches
 *
 * @param {import('../BaseState.js').BaseState} baseState
 * @param {boolean} [skipFetchingFromFork=false]
 * @returns {(address: import('@tevm/utils').EthjsAddress) => Promise<Uint8Array>}
 */
export const getContractCode =
	(baseState, skipFetchingFromFork = false) =>
	async (address) => {
		const {
			options,
			caches: { contracts },
			forkCache: { contracts: forkContracts },
		} = baseState

		// First check main cache
		const codeBytes = contracts.get(address)
		if (codeBytes !== undefined) {
			return codeBytes
		}

		// Then check fork cache if we have a fork
		if (options.fork?.transport) {
			const forkCodeBytes = forkContracts.get(address)
			if (forkCodeBytes !== undefined) {
				// Also update main cache with value from fork cache
				contracts.put(address, forkCodeBytes)
				baseState.logger.debug({ address }, 'Retrieved contract code from fork cache')
				return forkCodeBytes
			}
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
			// Store empty code in both caches
			contracts.put(address, EMPTY_CODE)
			forkContracts.put(address, EMPTY_CODE)
			return EMPTY_CODE
		}

		const remoteCodeBytes = hexToBytes(remoteCode)

		// Store in both caches
		contracts.put(address, remoteCodeBytes)
		forkContracts.put(address, remoteCodeBytes)

		baseState.logger.debug(
			{ address, deployedBytecode: bytesToHex(remoteCodeBytes) },
			'Cached forked contract bytecode to state and fork cache',
		)

		return remoteCodeBytes
	}
