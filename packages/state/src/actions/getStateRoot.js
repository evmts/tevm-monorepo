import { hexToBytes } from 'viem'

/**
 * Gets the current state root
 * @type {import("../state-types/index.js").StateAction<'getStateRoot'>}
 */
export const getStateRoot = (baseState) => async () => {
	return hexToBytes(baseState._currentStateRoot)
}
