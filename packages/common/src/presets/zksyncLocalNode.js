// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { zksyncLocalNode as _zksyncLocalNode } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the zksyncLocalNode chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 270
 * Chain Name: ZKsync CLI Local Node
 * Default Block Explorer: Not specified
 * Default RPC URL: http://localhost:3050
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { zksyncLocalNode } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: zksyncLocalNode,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const zksyncLocalNode = createCommon({
	..._zksyncLocalNode,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})