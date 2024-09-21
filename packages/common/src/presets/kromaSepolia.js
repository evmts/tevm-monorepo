// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { kromaSepolia as _kromaSepolia } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the kromaSepolia chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 2358
 * Chain Name: Kroma Sepolia
 * Default Block Explorer: https://blockscout.sepolia.kroma.network
 * Default RPC URL: https://api.sepolia.kroma.network
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { kromaSepolia } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: kromaSepolia,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const kromaSepolia = createCommon({
	..._kromaSepolia,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})
