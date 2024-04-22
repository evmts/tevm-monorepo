/**
 * @deprecated
 * Returns the applied key for a given address
 * Used for saving preimages
 * @type {import("../state-types/index.js").StateAction<'getAppliedKey'>}
 */
export const getAppliedKey = () => () => {
	throw new Error('not implemented')
	// return baseState._trie['appliedKey'](address)
}
