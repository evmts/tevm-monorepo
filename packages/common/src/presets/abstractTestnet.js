// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { abstractTestnet as _abstractTestnet } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the abstractTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 11124
 * Chain Name: Abstract Testnet
 * Default Block Explorer: https://explorer.testnet.abs.xyz
 * Default RPC URL: https://api.testnet.abs.xyz
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { abstractTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: abstractTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const abstractTestnet = createCommon({
	..._abstractTestnet,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})