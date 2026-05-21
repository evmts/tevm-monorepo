import { InternalError } from '@tevm/errors'

/**
 * @param {Uint8Array} bytes
 * @returns {Uint8Array}
 */
export const stripZeros = (bytes) => {
	if (!(bytes instanceof Uint8Array)) {
		throw new InternalError('Unexpected type')
	}
	const firstNonZero = bytes.findIndex(/** @param {number} entry*/ (entry) => entry !== 0)
	return firstNonZero === -1 ? new Uint8Array() : bytes.slice(firstNonZero)
}
