// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { skaleRazor as _skaleRazor } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the skaleRazor chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 278611351
 * Chain Name: SKALE | Razor Network
 * Default Block Explorer: https://turbulent-unique-scheat.explorer.mainnet.skalenodes.com
 * Default RPC URL: https://mainnet.skalenodes.com/v1/turbulent-unique-scheat
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { skaleRazor } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: skaleRazor,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const skaleRazor = createCommon({
	..._skaleRazor,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})
