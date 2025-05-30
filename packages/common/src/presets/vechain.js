// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { vechain as _vechain } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the vechain chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 100009
 * Chain Name: Vechain
 * Default Block Explorer: https://explore.vechain.org
 * Default RPC URL: https://mainnet.vechain.org
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { vechain } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: vechain,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const vechain = createCommon({
	..._vechain,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
