// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { mantleTestnet as _mantleTestnet } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the mantleTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 5001
 * Chain Name: Mantle Testnet
 * Default Block Explorer: https://explorer.testnet.mantle.xyz
 * Default RPC URL: https://rpc.testnet.mantle.xyz
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { mantleTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: mantleTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const mantleTestnet = createCommon({
	..._mantleTestnet,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})