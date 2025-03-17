// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { meterTestnet as _meterTestnet } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the meterTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 83
 * Chain Name: Meter Testnet
 * Default Block Explorer: https://scan-warringstakes.meter.io
 * Default RPC URL: https://rpctest.meter.io
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { meterTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: meterTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const meterTestnet = createCommon({
	..._meterTestnet,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'homestead',
})
