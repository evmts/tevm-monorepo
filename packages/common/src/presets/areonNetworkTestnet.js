// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { areonNetworkTestnet as _areonNetworkTestnet } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the areonNetworkTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 462
 * Chain Name: Areon Network Testnet
 * Default Block Explorer: https://areonscan.com
 * Default RPC URL: https://testnet-rpc.areon.network
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { areonNetworkTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: areonNetworkTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const areonNetworkTestnet = createCommon({
	..._areonNetworkTestnet,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
