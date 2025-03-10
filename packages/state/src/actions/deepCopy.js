import { InternalError } from '@tevm/errors'
import { createBaseState } from '../createBaseState.js'
import { dumpCanonicalGenesis } from './dumpCannonicalGenesis.js'

/**
 * Returns a new instance of the ForkStateManager with the same opts and all storage copied over.
 *
 * IMPORTANT: The fork cache is NOT copied but instead is shared between the original state
 * and the copied state. This is intentional and safe because:
 * 1. Fork cache is read-only relative to the forked blockchain state at a specific block
 * 2. Sharing the cache improves performance by preventing duplicate remote fetches
 * 3. It enables persistent caching of fork data across VM instances
 *
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
		throw new InternalError('Attempted to deepCopy state with uncommitted checkpoints')
	}
	const newState = createBaseState({
		...baseState.options,
		genesisState: await dumpCanonicalGenesis(baseState)(),
		stateRoots: new Map(baseState.stateRoots),
		currentStateRoot: baseState.getCurrentStateRoot(),
	})

	await newState.ready()

	// Share the fork cache object between instances rather than copying it
	// This is safe because the fork cache is conceptually read-only
	// relative to the forked blockchain at a specific block
	if (baseState.forkCache) {
		// Directly assign the same fork cache object
		newState.forkCache = baseState.forkCache
		baseState.logger.debug('Sharing fork cache reference between original and copied state')
	}

	baseState.logger.debug("Successfully deepCopy'd StateManager with shared fork cache")
	return newState
}
