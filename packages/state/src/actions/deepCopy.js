import { createBaseState } from '../createBaseState.js'
import { checkpoint } from './checkpoint.js'
import { commit } from './commit.js'
import { dumpCanonicalGenesis } from './dumpCannonicalGenesis.js'
import { generateCanonicalGenesis } from './generateCannonicalGenesis.js'

/**
 * Returns a new instance of the ForkStateManager with the same opts and all storage copied over
 * @param {import('../BaseState.js').BaseState} baseState
 * @returns {() => Promise<import('../BaseState.js').BaseState>}
 */
export const deepCopy = (baseState) => async () => {
	const newState = createBaseState(baseState._options)
	await generateCanonicalGenesis(newState)(await dumpCanonicalGenesis(baseState)())

	await checkpoint(newState)()
	await commit(newState)()

	newState._stateRoots = new Map(baseState._stateRoots)
	newState._currentStateRoot = Uint8Array.from(baseState._currentStateRoot)

	return newState
}
