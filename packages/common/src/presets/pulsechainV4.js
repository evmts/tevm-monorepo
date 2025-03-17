// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { pulsechainV4 as _pulsechainV4 } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the pulsechainV4 chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 943
 * Chain Name: PulseChain V4
 * Default Block Explorer: https://scan.v4.testnet.pulsechain.com
 * Default RPC URL: https://rpc.v4.testnet.pulsechain.com
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { pulsechainV4 } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: pulsechainV4,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const pulsechainV4 = createCommon({
	..._pulsechainV4,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'homestead',
})
