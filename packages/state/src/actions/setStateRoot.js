import { bytesToHex } from 'viem'
import { generateCanonicalGenesis } from './generateCannonicalGenesis.js'
import { commit } from './commit.js'
import { checkpoint } from './checkpoint.js'

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
    baseState._caches.accounts._checkpoints > 0 ||
    baseState._caches.storage._checkpoints > 0 ||
    baseState._caches.contracts._checkpoints > 0
  ) {
    throw new Error('Attempted to setStateRoot with uncommitted checkpoints')
  }
  const genesis = baseState._stateRoots.get(bytesToHex(root))
  if (!genesis) {
    throw new NoStateRootExistsError(`State root for ${bytesToHex(root)} does not exist`)
  }
  const oldStateRoot = baseState._currentStateRoot
  try {
    baseState._currentStateRoot = root
    await generateCanonicalGenesis(baseState)(genesis)
    await checkpoint(baseState)()
    await commit(baseState)()
    return
  } catch (e) {
    baseState._currentStateRoot = oldStateRoot
    throw e
  }
}
