import { AsyncEventEmitter } from '@tevm/utils'

/**
 * @param {import('./VmOpts.js').VmOpts} opts
 * @returns {import('./BaseVm.js').BaseVm}
 */
export const createBaseVm = (opts) => {
  /**
   * @type {import('./BaseVm.js').BaseVm['events']}
   */
  const events = new AsyncEventEmitter()
  return {
    stateManager: opts.stateManager,
    evm: opts.evm,
    blockchain: opts.blockchain,
    common: opts.common,
    events,
    _emit: async (topic, data) => {
      return new Promise((resolve) => events.emit(topic, data, resolve))
    },
    ready: async () => {
      await Promise.all([opts.blockchain.ready()])
      return true
    },
  }
}
