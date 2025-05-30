// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { xaiTestnet as _xaiTestnet } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the xaiTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 37714555429
 * Chain Name: Xai Testnet
 * Default Block Explorer: https://testnet-explorer-v2.xai-chain.net
 * Default RPC URL: https://testnet-v2.xai-chain.net/rpc
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { xaiTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: xaiTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const xaiTestnet = createCommon({
	..._xaiTestnet,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
