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
export const setStateRoot = (baseState) => (root) => {
	const genesis = baseState._stateRoots.get(root)
	if (!genesis) {
		throw new NoStateRootExistsError(`State root for ${bytesToHex(root)} does not exist`)
	}
	return generateCanonicalGenesis(baseState)(genesis)
}
