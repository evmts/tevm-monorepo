// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { shibariumTestnet as _shibariumTestnet } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the shibariumTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 157
 * Chain Name: Puppynet Shibarium
 * Default Block Explorer: https://puppyscan.shib.io
 * Default RPC URL: https://puppynet.shibrpc.com
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { shibariumTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: shibariumTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const shibariumTestnet = createCommon({
	..._shibariumTestnet,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})