// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { flareTestnet as _flareTestnet } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the flareTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 114
 * Chain Name: Coston2
 * Default Block Explorer: https://coston2-explorer.flare.network
 * Default RPC URL: https://coston2-api.flare.network/ext/C/rpc
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { flareTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: flareTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const flareTestnet = createCommon({
	..._flareTestnet,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})