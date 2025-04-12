// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { bxnTestnet as _bxnTestnet } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the bxnTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 4777
 * Chain Name: BlackFort Exchange Network Testnet
 * Default Block Explorer: https://testnet-explorer.blackfort.network
 * Default RPC URL: https://testnet.blackfort.network/rpc
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { bxnTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: bxnTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const bxnTestnet = createCommon({
	..._bxnTestnet,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'homestead',
})
