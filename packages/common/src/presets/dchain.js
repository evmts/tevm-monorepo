// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { dchain as _dchain } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the dchain chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 2716446429837000
 * Chain Name: Dchain
 * Default Block Explorer: https://dchain-2716446429837000-1.sagaexplorer.io
 * Default RPC URL: https://dchain-2716446429837000-1.jsonrpc.sagarpc.io
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { dchain } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: dchain,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const dchain = createCommon({
	..._dchain,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
