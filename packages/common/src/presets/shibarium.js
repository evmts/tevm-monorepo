// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { shibarium as _shibarium } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the shibarium chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 109
 * Chain Name: Shibarium
 * Default Block Explorer: https://shibariumscan.io
 * Default RPC URL: https://rpc.shibrpc.com
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { shibarium } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: shibarium,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const shibarium = createCommon({
	..._shibarium,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})
