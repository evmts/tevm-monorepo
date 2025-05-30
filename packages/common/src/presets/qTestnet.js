// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { qTestnet as _qTestnet } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the qTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 35443
 * Chain Name: Q Testnet
 * Default Block Explorer: https://explorer.qtestnet.org
 * Default RPC URL: https://rpc.qtestnet.org
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { qTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: qTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const qTestnet = createCommon({
	..._qTestnet,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
