import { createBaseChain } from '../createBaseChain.js'

/**
 * @param {import('../BaseChain.js').BaseChain} baseChain
 * @returns {() => import('../BaseChain.js').BaseChain}
 */
export const shallowCopy = (baseChain) => () => {
  return createBaseChain(baseChain.options)
}
