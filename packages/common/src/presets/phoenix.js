// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { phoenix as _phoenix } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the phoenix chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 13381
 * Chain Name: Phoenix Blockchain
 * Default Block Explorer: https://phoenixplorer.com
 * Default RPC URL: https://rpc.phoenixplorer.com
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { phoenix } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: phoenix,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const phoenix = createCommon({
	..._phoenix,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
