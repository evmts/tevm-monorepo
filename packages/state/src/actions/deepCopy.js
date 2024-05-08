import { createBaseState } from '../createBaseState.js'
import { dumpCanonicalGenesis } from './dumpCannonicalGenesis.js'

/**
 * Returns a new instance of the ForkStateManager with the same opts and all storage copied over
 * @param {import('../BaseState.js').BaseState} baseState
 * @returns {() => Promise<import('../BaseState.js').BaseState>}
 */
export const deepCopy = (baseState) => async () => {
  console.log('in deepCopy', baseState._currentStateRoot)
  if (
    baseState._caches.accounts._checkpoints > 0 ||
    baseState._caches.storage._checkpoints > 0 ||
    baseState._caches.contracts._checkpoints > 0
  ) {
    throw new Error('Attempted to deepCopy state with uncommitted checkpoints')
  }
  const newStateRoots = new Map([...baseState._stateRoots.entries()].map(([root, state]) => [root, Object.fromEntries(Object.entries(state).map(([accountKey, storage]) => [accountKey, { ...storage }]))]))
  const newState = createBaseState({
    ...baseState._options,
    stateRoots: newStateRoots,
    genesisState: await dumpCanonicalGenesis(baseState)()
  })
  await newState.ready()
  console.log('setting in deepCopy', baseState._currentStateRoot)
  newState._currentStateRoot = baseState._currentStateRoot
  return newState
}
