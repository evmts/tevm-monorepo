// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { celo as _celo } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the celo chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 42220
 * Chain Name: Celo
 * Default Block Explorer: https://celoscan.io
 * Default RPC URL: https://forno.celo.org
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { celo } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: celo,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const celo = createCommon({
	..._celo,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
