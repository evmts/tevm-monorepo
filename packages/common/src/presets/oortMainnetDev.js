// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { oortMainnetDev as _oortMainnetDev } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the oortMainnetDev chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 9700
 * Chain Name: OORT MainnetDev
 * Default Block Explorer: https://dev-scan.oortech.com
 * Default RPC URL: https://dev-rpc.oortech.com
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { oortMainnetDev } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: oortMainnetDev,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const oortMainnetDev = createCommon({
	..._oortMainnetDev,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})