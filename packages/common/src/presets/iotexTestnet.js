// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { iotexTestnet as _iotexTestnet } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the iotexTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 4690
 * Chain Name: IoTeX Testnet
 * Default Block Explorer: https://testnet.iotexscan.io
 * Default RPC URL: https://babel-api.testnet.iotex.io
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { iotexTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: iotexTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const iotexTestnet = createCommon({
	..._iotexTestnet,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
