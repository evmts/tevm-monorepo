import { TevmCommon } from './TevmCommon.js'
import { Hardfork } from '@ethereumjs/common'

/**
 * Creates an ethereumjs Common object used by the EVM
 * to access chain and hardfork parameters and to provide
 * a unified and shared view on the network and hardfork state.
 * @param {import('./CommonOptions.js').CommonOptions} options
 * @returns {TevmCommon}
 */
export const createCommon = (options) => {
	return new TevmCommon({
		chain: 1,
		hardfork: options.hardfork ?? Hardfork.Shanghai,
		eips: /**@type number[]*/ (options.eips ?? [1559, 4895]),
		customChains: [],
	})
}
