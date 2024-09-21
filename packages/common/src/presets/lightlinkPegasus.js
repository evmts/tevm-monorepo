// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { lightlinkPegasus as _lightlinkPegasus } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the lightlinkPegasus chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 1891
 * Chain Name: LightLink Pegasus Testnet
 * Default Block Explorer: https://pegasus.lightlink.io
 * Default RPC URL: https://replicator.pegasus.lightlink.io/rpc/v1
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { lightlinkPegasus } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: lightlinkPegasus,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const lightlinkPegasus = createCommon({
	..._lightlinkPegasus,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})
