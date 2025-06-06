// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { mantaTestnet as _mantaTestnet } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the mantaTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 3441005
 * Chain Name: Manta Pacific Testnet
 * Default Block Explorer: https://pacific-explorer.testnet.manta.network
 * Default RPC URL: https://manta-testnet.calderachain.xyz/http
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { mantaTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: mantaTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const mantaTestnet = createCommon({
	..._mantaTestnet,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
