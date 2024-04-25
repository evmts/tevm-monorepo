/**
 * Gets the current state root
 * @type {import("../state-types/index.js").StateAction<'getStateRoot'>}
 */
export const getStateRoot = (baseState) => async () => {
	return baseState._currentStateRoot
}
