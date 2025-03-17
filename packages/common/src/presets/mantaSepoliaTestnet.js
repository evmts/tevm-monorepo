// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { mantaSepoliaTestnet as _mantaSepoliaTestnet } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the mantaSepoliaTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 3441006
 * Chain Name: Manta Pacific Sepolia Testnet
 * Default Block Explorer: https://pacific-explorer.sepolia-testnet.manta.network
 * Default RPC URL: https://pacific-rpc.sepolia-testnet.manta.network/http
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { mantaSepoliaTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: mantaSepoliaTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const mantaSepoliaTestnet = createCommon({
	..._mantaSepoliaTestnet,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'homestead',
})
