// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { aurora as _aurora } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the aurora chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 1313161554
 * Chain Name: Aurora
 * Default Block Explorer: https://aurorascan.dev
 * Default RPC URL: https://mainnet.aurora.dev
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { aurora } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: aurora,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const aurora = createCommon({
	..._aurora,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'homestead',
})
