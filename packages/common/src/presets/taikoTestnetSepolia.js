// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { taikoTestnetSepolia as _taikoTestnetSepolia } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the taikoTestnetSepolia chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 167005
 * Chain Name: Taiko (Alpha-3 Testnet)
 * Default Block Explorer: https://explorer.test.taiko.xyz
 * Default RPC URL: https://rpc.test.taiko.xyz
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { taikoTestnetSepolia } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: taikoTestnetSepolia,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const taikoTestnetSepolia = createCommon({
	..._taikoTestnetSepolia,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
