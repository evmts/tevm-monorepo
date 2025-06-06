// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { polygonZkEvmTestnet as _polygonZkEvmTestnet } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the polygonZkEvmTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 1442
 * Chain Name: Polygon zkEVM Testnet
 * Default Block Explorer: https://testnet-zkevm.polygonscan.com
 * Default RPC URL: https://rpc.public.zkevm-test.net
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { polygonZkEvmTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: polygonZkEvmTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const polygonZkEvmTestnet = createCommon({
	..._polygonZkEvmTestnet,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
