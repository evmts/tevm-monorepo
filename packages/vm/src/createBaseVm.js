import { AsyncEventEmitter } from '@tevm/utils'

/**
 * @param {import('./VmOpts.js').VmOpts} opts
 * @returns {import('./actions/deepCopy.js').BaseVm}
 */
export const createBaseVm = (opts) => {
  return {
    stateManager: opts.stateManager,
    evm: opts.evm,
    blockchain: opts.blockchain,
    common: opts.common,
    events: new AsyncEventEmitter(),
    ready: async () => {
      await Promise.all([opts.blockchain.ready()])
      return true
    },
  }
}
