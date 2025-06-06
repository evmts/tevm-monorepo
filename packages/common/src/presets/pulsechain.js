// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { pulsechain as _pulsechain } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the pulsechain chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 369
 * Chain Name: PulseChain
 * Default Block Explorer: https://scan.pulsechain.com
 * Default RPC URL: https://rpc.pulsechain.com
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { pulsechain } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: pulsechain,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const pulsechain = createCommon({
	..._pulsechain,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
