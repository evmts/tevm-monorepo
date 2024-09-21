// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { etherlink as _etherlink } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the etherlink chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 42793
 * Chain Name: Etherlink
 * Default Block Explorer: https://explorer.etherlink.com
 * Default RPC URL: https://node.mainnet.etherlink.com
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { etherlink } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: etherlink,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const etherlink = createCommon({
	..._etherlink,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})
