import { createBaseChain } from '../createBaseChain.js'

/**
 * @param {import('../BaseChain.js').BaseChain} baseChain
 * @returns {() => Promise<import('../BaseChain.js').BaseChain>}
 */
export const deepCopy = (baseChain) => async () => {
  await baseChain.ready()
  const chain = createBaseChain({
    common: baseChain.common.copy(),
  })
  chain.blocksByTag = new Map(baseChain.blocksByTag.entries())
  chain.blocks = new Map(baseChain.blocks.entries())
  chain.blocksByNumber = new Map(baseChain.blocksByNumber.entries())
  return chain
}
