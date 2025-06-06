// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { bahamut as _bahamut } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the bahamut chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 5165
 * Chain Name: Bahamut
 * Default Block Explorer: https://www.ftnscan.com
 * Default RPC URL: https://rpc1.bahamut.io
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { bahamut } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: bahamut,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const bahamut = createCommon({
	..._bahamut,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
