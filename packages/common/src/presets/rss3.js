// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { rss3 as _rss3 } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the rss3 chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 12553
 * Chain Name: RSS3 VSL Mainnet
 * Default Block Explorer: https://scan.rss3.io
 * Default RPC URL: https://rpc.rss3.io
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { rss3 } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: rss3,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const rss3 = createCommon({
	..._rss3,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})
