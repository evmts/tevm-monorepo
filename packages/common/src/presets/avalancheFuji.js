// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { avalancheFuji as _avalancheFuji } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the avalancheFuji chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 43113
 * Chain Name: Avalanche Fuji
 * Default Block Explorer: https://testnet.snowtrace.io
 * Default RPC URL: https://api.avax-test.network/ext/bc/C/rpc
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { avalancheFuji } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: avalancheFuji,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const avalancheFuji = createCommon({
	..._avalancheFuji,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
