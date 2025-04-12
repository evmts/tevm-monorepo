// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { bobSepolia as _bobSepolia } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the bobSepolia chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 808813
 * Chain Name: BOB Sepolia
 * Default Block Explorer: https://bob-sepolia.explorer.gobob.xyz
 * Default RPC URL: https://bob-sepolia.rpc.gobob.xyz
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { bobSepolia } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: bobSepolia,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const bobSepolia = createCommon({
	..._bobSepolia,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'homestead',
})
