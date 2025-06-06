// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { redbellyTestnet as _redbellyTestnet } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the redbellyTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 153
 * Chain Name: Redbelly Network Testnet
 * Default Block Explorer: https://explorer.testnet.redbelly.network
 * Default RPC URL: https://governors.testnet.redbelly.network
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { redbellyTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: redbellyTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const redbellyTestnet = createCommon({
	..._redbellyTestnet,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
