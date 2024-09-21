// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { pgnTestnet as _pgnTestnet } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the pgnTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 58008
 * Chain Name: PGN
 * Default Block Explorer: https://explorer.sepolia.publicgoods.network
 * Default RPC URL: https://sepolia.publicgoods.network
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { pgnTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: pgnTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const pgnTestnet = createCommon({
	..._pgnTestnet,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})
