import { UnexpectedInternalServerError } from '@tevm/errors'
import { createBaseState } from '../createBaseState.js'
import { dumpCanonicalGenesis } from './dumpCannonicalGenesis.js'

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
		throw new UnexpectedInternalServerError('Attempted to deepCopy state with uncommitted checkpoints')
	}
	const newState = createBaseState({
		...baseState.options,
		genesisState: await dumpCanonicalGenesis(baseState)(),
		stateRoots: new Map(baseState.stateRoots),
		currentStateRoot: baseState.getCurrentStateRoot(),
	})
	await newState.ready()
	baseState.logger.debug("Successfully deepCopy'd StateManager")
	return newState
}
