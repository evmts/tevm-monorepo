import { createBaseState } from '../createBaseState.js'

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
    stateRoots: new Map(baseState.stateRoots),
    currentStateRoot: baseState.getCurrentStateRoot()
  })
  await newState.ready()
  return newState
}
