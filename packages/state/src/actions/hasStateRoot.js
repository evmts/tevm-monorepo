import { bytesToHex } from '@tevm/utils'

/**
 * Returns true if state root exists
 * @type {import("../state-types/index.js").StateAction<'hasStateRoot'>}
 */
export const hasStateRoot = (baseState) => (root) => {
	return Promise.resolve(baseState.stateRoots.has(bytesToHex(root)))
}
