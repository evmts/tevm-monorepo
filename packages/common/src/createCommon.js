import { Hardfork } from '@ethereumjs/common'
import { Common } from '@ethereumjs/common'

/**
 * Creates an ethereumjs Common object used by the EVM
 * to access chain and hardfork parameters and to provide
 * a unified and shared view on the network and hardfork state.
 * @param {import('./CommonOptions.js').CommonOptions} [options]
 * @returns {Common}
 */
export const createCommon = (options = {}) => {
  return new Common({
    chain: 1,
    hardfork: options.hardfork ?? Hardfork.Cancun,
    eips: [...(options.eips ?? []), 1559, 4895],
    customChains: [],
  })
}
