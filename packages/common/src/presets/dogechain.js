// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { dogechain as _dogechain } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the dogechain chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 2000
 * Chain Name: Dogechain
 * Default Block Explorer: https://explorer.dogechain.dog
 * Default RPC URL: https://rpc.dogechain.dog
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { dogechain } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: dogechain,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const dogechain = createCommon({
	..._dogechain,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})