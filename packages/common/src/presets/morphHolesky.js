// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { morphHolesky as _morphHolesky } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the morphHolesky chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 2810
 * Chain Name: Morph Holesky
 * Default Block Explorer: https://explorer-holesky.morphl2.io
 * Default RPC URL: https://rpc-quicknode-holesky.morphl2.io
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { morphHolesky } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: morphHolesky,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const morphHolesky = createCommon({
	..._morphHolesky,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})
