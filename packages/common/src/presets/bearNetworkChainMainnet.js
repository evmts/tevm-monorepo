// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { bearNetworkChainMainnet as _bearNetworkChainMainnet } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the bearNetworkChainMainnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 641230
 * Chain Name: Bear Network Chain Mainnet
 * Default Block Explorer: https://brnkscan.bearnetwork.net
 * Default RPC URL: https://brnkc-mainnet.bearnetwork.net
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { bearNetworkChainMainnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: bearNetworkChainMainnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const bearNetworkChainMainnet = createCommon({
	..._bearNetworkChainMainnet,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
