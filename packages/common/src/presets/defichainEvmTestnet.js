// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { defichainEvmTestnet as _defichainEvmTestnet } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the defichainEvmTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 1131
 * Chain Name: DeFiChain EVM Testnet
 * Default Block Explorer: https://meta.defiscan.live/?network=TestNet
 * Default RPC URL: https://eth.testnet.ocean.jellyfishsdk.com
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { defichainEvmTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: defichainEvmTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const defichainEvmTestnet = createCommon({
	..._defichainEvmTestnet,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
