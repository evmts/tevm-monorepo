import { hexToBytes } from 'ethereum-cryptography/utils'

/**
 * Gets the current state root
 * @type {import("../state-types/index.js").StateAction<'getStateRoot'>}
 */
export const getStateRoot = (baseState) => async () => {
	return hexToBytes(baseState.getCurrentStateRoot())
}
