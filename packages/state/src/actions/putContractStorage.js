import { InternalError } from '@tevm/errors'
import { stripZeros } from '../utils/stripZeros.js'
import { getAccount } from './getAccount.js'

/**
 * Adds value to the cache for the `account`
 * corresponding to `address` at the provided `key`.
 * Cannot be more than 32 bytes. Leading zeros are stripped.
 * If it is empty or filled with zeros, deletes the value.
 * @param {import('../BaseState.js').BaseState} baseState
 * @returns {(address: import('@tevm/utils').EthjsAddress, key: Uint8Array, value: Uint8Array) => Promise<void>}
 */
export const putContractStorage = (baseState) => async (address, key, value) => {
	if (key.length !== 32) {
		throw new InternalError(`Storage key must be 32 bytes long. Received ${key}`)
	}

	const account = await getAccount(baseState)(address)
	if (!account) {
		throw new InternalError(
			'cannot putContractStorage on non existing acccount! Consider checking if account exists first',
		)
	}
	baseState.caches.storage.put(address, key, stripZeros(value))
}
