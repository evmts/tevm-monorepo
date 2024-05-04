/**
 * Saves a given state root and value to the state root mapping
 * @param {import('../BaseState.js').BaseState} baseState
 * @returns {(root: Uint8Array, state: import('../state-types/TevmState.js').TevmState) => void}
 */
export const saveStateRoot = (baseState) => (root, value) => {
	baseState._stateRoots.set(root, value)
}
