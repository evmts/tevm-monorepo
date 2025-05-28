import { bytesToHex } from 'viem'
import { generateCanonicalGenesis } from './generateCannonicalGenesis.js'

/**
 * Error thrown if state root doesn't exist
 */
export class NoStateRootExistsError extends Error {
	/**
	 * @override
	 * @type {'NoStateRootExistsError'}
	 */
	name = 'NoStateRootExistsError'
	/**
	 * @type {'NoStateRootExistsError'}
	 */
	_tag = 'NoStateRootExistsError'
}

/**
 * Changes the currently loaded state root
 * @type {import("../state-types/index.js").StateAction<'setStateRoot'>}
 */
export const setStateRoot = (baseState) => async (root) => {
	if (
		baseState.caches.accounts._checkpoints > 0 ||
		baseState.caches.storage._checkpoints > 0 ||
		baseState.caches.contracts._checkpoints > 0
	) {
		throw new Error('Attempted to setStateRoot with uncommitted checkpoints')
	}
	const genesis = baseState.stateRoots.get(bytesToHex(root))
	// TODO we need to handle the fok case here
	if (!genesis) {
		throw new NoStateRootExistsError(`State root for ${bytesToHex(root)} does not exist`)
	}
	const oldStateRoot = baseState.getCurrentStateRoot()
	try {
		baseState.setCurrentStateRoot(bytesToHex(root))
		const generateFn = generateCanonicalGenesis(baseState)
		if (generateFn) {
			await generateFn(genesis)
		}
		baseState.logger.debug({ oldStateRoot, newStateRoot: root }, 'state root changed')
		return
	} catch (e) {
		baseState.setCurrentStateRoot(oldStateRoot)
		throw e
	}
}
