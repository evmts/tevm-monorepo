import { createBaseState } from '../createBaseState.js'
import { dumpCanonicalGenesis } from './dumpCannonicalGenesis.js'
import { generateCanonicalGenesis } from './generateCannonicalGenesis.js'

/**
 * Returns a new instance of the ForkStateManager with the same opts and all storage copied over
 * @param {import('../BaseState.js').BaseState} baseState
 * @returns {() => Promise<import('../BaseState.js').BaseState>}
 */
export const deepCopy = (baseState) => async () => {
	await baseState.ready()
	if (
		baseState.caches.accounts._checkpoints > 0 ||
		baseState.caches.storage._checkpoints > 0 ||
		baseState.caches.contracts._checkpoints > 0
	) {
		throw new Error('Attempted to deepCopy state with uncommitted checkpoints')
	}
	const newState = createBaseState({
		...baseState.options,
	})
	await newState.ready()
	const currentState = await dumpCanonicalGenesis(baseState)()
	baseState.logger.debug(currentState, 'Deep copying state...')
	await generateCanonicalGenesis(newState)(currentState)
	newState.stateRoots.set(baseState.getCurrentStateRoot(), currentState)
	newState.setCurrentStateRoot(baseState.getCurrentStateRoot())
	baseState.logger.debug("Successfully deepCopy'd StateManager")
	return newState
}
