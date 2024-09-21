// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { edgelessTestnet as _edgelessTestnet } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the edgelessTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 202
 * Chain Name: Edgeless Testnet
 * Default Block Explorer: https://testnet.explorer.edgeless.network
 * Default RPC URL: https://edgeless-testnet.rpc.caldera.xyz/http
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { edgelessTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: edgelessTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const edgelessTestnet = createCommon({
	..._edgelessTestnet,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})
