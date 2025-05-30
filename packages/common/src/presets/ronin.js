// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { ronin as _ronin } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the ronin chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 2020
 * Chain Name: Ronin
 * Default Block Explorer: https://app.roninchain.com
 * Default RPC URL: https://api.roninchain.com/rpc
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { ronin } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: ronin,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const ronin = createCommon({
	..._ronin,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
