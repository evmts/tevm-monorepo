// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { skaleTitan as _skaleTitan } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the skaleTitan chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 1350216234
 * Chain Name: SKALE | Titan Community Hub
 * Default Block Explorer: https://parallel-stormy-spica.explorer.mainnet.skalenodes.com
 * Default RPC URL: https://mainnet.skalenodes.com/v1/parallel-stormy-spica
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { skaleTitan } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: skaleTitan,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const skaleTitan = createCommon({
	..._skaleTitan,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
