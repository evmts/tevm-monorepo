// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { gravity as _gravity } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the gravity chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 1625
 * Chain Name: Gravity Alpha Mainnet
 * Default Block Explorer: https://explorer.gravity.xyz
 * Default RPC URL: https://rpc.gravity.xyz
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { gravity } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: gravity,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const gravity = createCommon({
	..._gravity,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
