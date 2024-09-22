// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { b3Sepolia as _b3Sepolia } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the b3Sepolia chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 1993
 * Chain Name: B3 Sepolia
 * Default Block Explorer: https://sepolia.explorer.b3.fun
 * Default RPC URL: https://sepolia.b3.fun/http
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { b3Sepolia } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: b3Sepolia,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const b3Sepolia = createCommon({
	..._b3Sepolia,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})