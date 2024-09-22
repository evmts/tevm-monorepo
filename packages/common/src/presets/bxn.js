// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { bxn as _bxn } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the bxn chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 4999
 * Chain Name: BlackFort Exchange Network
 * Default Block Explorer: https://explorer.blackfort.network
 * Default RPC URL: https://mainnet.blackfort.network/rpc
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { bxn } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: bxn,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const bxn = createCommon({
	..._bxn,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})