// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { darwinia as _darwinia } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the darwinia chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 46
 * Chain Name: Darwinia Network
 * Default Block Explorer: https://explorer.darwinia.network
 * Default RPC URL: https://rpc.darwinia.network
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { darwinia } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: darwinia,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const darwinia = createCommon({
	..._darwinia,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})
