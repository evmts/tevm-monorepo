// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { fraxtal as _fraxtal } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the fraxtal chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 252
 * Chain Name: Fraxtal
 * Default Block Explorer: https://fraxscan.com
 * Default RPC URL: https://rpc.frax.com
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { fraxtal } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: fraxtal,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const fraxtal = createCommon({
	..._fraxtal,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})