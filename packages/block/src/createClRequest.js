// This functionality was unreleased in ethereumjs at the time I made this
// we might be able to delete this code and import ClRequest from ethereumjs in future
import { concatBytes } from '@tevm/utils'

/**
 * @param {number} type
 * @param {Uint8Array} bytes
 * @returns {import('./ClRequest.js').ClRequest}
 */
export const createClRequest = (type, bytes) => {
	return {
		type,
		bytes,
		serialize: () => {
			return concatBytes(Uint8Array.from([type]), bytes)
		},
	}
}
