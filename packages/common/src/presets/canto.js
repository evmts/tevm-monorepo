// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { canto as _canto } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the canto chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 7700
 * Chain Name: Canto
 * Default Block Explorer: https://tuber.build
 * Default RPC URL: https://canto.gravitychain.io
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { canto } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: canto,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const canto = createCommon({
	..._canto,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
