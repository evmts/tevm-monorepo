// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { stratis as _stratis } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the stratis chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 105105
 * Chain Name: Stratis Mainnet
 * Default Block Explorer: https://explorer.stratisevm.com
 * Default RPC URL: https://rpc.stratisevm.com
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { stratis } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: stratis,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const stratis = createCommon({
	..._stratis,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
