// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { zhejiang as _zhejiang } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the zhejiang chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 1337803
 * Chain Name: Zhejiang
 * Default Block Explorer: https://zhejiang.beaconcha.in
 * Default RPC URL: https://rpc.zhejiang.ethpandaops.io
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { zhejiang } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: zhejiang,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const zhejiang = createCommon({
	..._zhejiang,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})
