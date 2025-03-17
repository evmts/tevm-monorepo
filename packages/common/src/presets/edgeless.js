// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { edgeless as _edgeless } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the edgeless chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 2026
 * Chain Name: Edgeless Network
 * Default Block Explorer: https://explorer.edgeless.network
 * Default RPC URL: https://rpc.edgeless.network/http
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { edgeless } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: edgeless,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const edgeless = createCommon({
	..._edgeless,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'homestead',
})
