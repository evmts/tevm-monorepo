// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { beam as _beam } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the beam chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 4337
 * Chain Name: Beam
 * Default Block Explorer: https://subnets.avax.network/beam
 * Default RPC URL: https://build.onbeam.com/rpc
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { beam } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: beam,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const beam = createCommon({
	..._beam,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})