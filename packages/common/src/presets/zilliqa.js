// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { zilliqa as _zilliqa } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the zilliqa chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 32769
 * Chain Name: Zilliqa
 * Default Block Explorer: https://evmx.zilliqa.com
 * Default RPC URL: https://api.zilliqa.com
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { zilliqa } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: zilliqa,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const zilliqa = createCommon({
	..._zilliqa,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
