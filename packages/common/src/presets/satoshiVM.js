// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { satoshiVM as _satoshiVM } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the satoshiVM chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 3109
 * Chain Name: SatoshiVM Alpha Mainnet
 * Default Block Explorer: https://svmscan.io
 * Default RPC URL: https://alpha-rpc-node-http.svmscan.io
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { satoshiVM } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: satoshiVM,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const satoshiVM = createCommon({
	..._satoshiVM,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'homestead',
})
