// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { ektaTestnet as _ektaTestnet } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the ektaTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 1004
 * Chain Name: Ekta Testnet
 * Default Block Explorer: https://test.ektascan.io
 * Default RPC URL: https://test.ekta.io:8545
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { ektaTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: ektaTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const ektaTestnet = createCommon({
	..._ektaTestnet,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})
