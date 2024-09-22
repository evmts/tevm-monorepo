// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { songbird as _songbird } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the songbird chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 19
 * Chain Name: Songbird Mainnet
 * Default Block Explorer: https://songbird-explorer.flare.network
 * Default RPC URL: https://songbird-api.flare.network/ext/C/rpc
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { songbird } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: songbird,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const songbird = createCommon({
	..._songbird,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})