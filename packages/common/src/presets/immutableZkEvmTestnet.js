// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { immutableZkEvmTestnet as _immutableZkEvmTestnet } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the immutableZkEvmTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 13473
 * Chain Name: Immutable zkEVM Testnet
 * Default Block Explorer: https://explorer.testnet.immutable.com/
 * Default RPC URL: https://rpc.testnet.immutable.com
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { immutableZkEvmTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: immutableZkEvmTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const immutableZkEvmTestnet = createCommon({
	..._immutableZkEvmTestnet,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
