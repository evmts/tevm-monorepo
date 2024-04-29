import { deepCopy } from './actions/deepCopy.js'
import { getBlock } from './actions/getBlock.js'
import { putBlock } from './actions/putBlock.js'
import { shallowCopy } from './actions/shallowCopy.js'
import { validateHeader } from './actions/validateHeader.js'
import { createBaseChain } from './createBaseChain.js'
/**
 * @param {import('./ChainOptions.js').ChainOptions} options
 * @returns {Promise<import('./Chain.js').Chain>}
 */
export const createChain = async (options) => {
  /**
   * @param {import('./BaseChain.js').BaseChain} baseChain
   */
  const decorate = (baseChain) => {
    return {
      ...baseChain,
      getBlock: getBlock(baseChain),
      putBlock: putBlock(baseChain),
      validateHeader: validateHeader(baseChain),
      deepCopy: () => decorate(deepCopy(baseChain)()),
      shallowCopy: () => decorate(shallowCopy(baseChain)()),
      /**
       * @type {import('@ethereumjs/blockchain').BlockchainInterface['consensus']}
       */
      get consensus() {
        throw new Error('consensus is not implemented')
      },
      /**
       * @type {import('@ethereumjs/blockchain').BlockchainInterface['delBlock']}
       */
      get delBlock() {
        throw new Error('delBlock is not implemented')
      },
      /**
       * @type {import('@ethereumjs/blockchain').BlockchainInterface['iterator']}
       */
      get iterator() {
        throw new Error('iterator is not implemented')
      },
      /**
       * @type {import('@ethereumjs/blockchain').BlockchainInterface['getIteratorHead']}
       */
      get getIteratorHead() {
        throw new Error('getIteratorHead is not implemented')
      },
      /**
       * @type {import('@ethereumjs/blockchain').BlockchainInterface['setIteratorHead']}
       */
      get setIteratorHead() {
        throw new Error('setIteratorHead is not implemented')
      },
      /**
       * @type {import('@ethereumjs/blockchain').BlockchainInterface['getCanonicalHeadBlock']}
       */
      get getCanonicalHeadBlock() {
        throw new Error('getCanonicalHeadBlock is not implemented')
      },


    }
  }
  return decorate(createBaseChain(options))
}
