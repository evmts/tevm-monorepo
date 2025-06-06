// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { skaleExorde as _skaleExorde } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the skaleExorde chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 2139927552
 * Chain Name: SKALE | Exorde
 * Default Block Explorer: https://light-vast-diphda.explorer.mainnet.skalenodes.com
 * Default RPC URL: https://mainnet.skalenodes.com/v1/light-vast-diphda
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { skaleExorde } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: skaleExorde,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const skaleExorde = createCommon({
	..._skaleExorde,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
