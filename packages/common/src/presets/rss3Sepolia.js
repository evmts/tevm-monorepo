// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { rss3Sepolia as _rss3Sepolia } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the rss3Sepolia chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 2331
 * Chain Name: RSS3 VSL Sepolia Testnet
 * Default Block Explorer: https://scan.testnet.rss3.io
 * Default RPC URL: https://rpc.testnet.rss3.io
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { rss3Sepolia } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: rss3Sepolia,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const rss3Sepolia = createCommon({
	..._rss3Sepolia,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'homestead',
})
