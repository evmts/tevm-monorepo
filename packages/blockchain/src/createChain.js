import { createBaseChain } from './createBaseChain.js'
/**
 * @param {import('./BaseChainOptions.js').BaseChainOptions} options
 * @returns {Promise<import('./Chain.js').Chain>}
 */
export const createBlockchain = async (options) => {
  const baseChain = createBaseChain(options)
  return {}
}
