// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { berachainTestnet as _berachainTestnet } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the berachainTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 80085
 * Chain Name: Berachain Artio
 * Default Block Explorer: https://artio.beratrail.io
 * Default RPC URL: https://artio.rpc.berachain.com
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { berachainTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: berachainTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const berachainTestnet = createCommon({
	..._berachainTestnet,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
