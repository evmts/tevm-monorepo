// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { blast as _blast } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the blast chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 81457
 * Chain Name: Blast
 * Default Block Explorer: https://blastscan.io
 * Default RPC URL: https://rpc.blast.io
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { blast } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: blast,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const blast = createCommon({
	..._blast,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})
