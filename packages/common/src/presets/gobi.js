// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { gobi as _gobi } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the gobi chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 1663
 * Chain Name: Horizen Gobi Testnet
 * Default Block Explorer: https://gobi-explorer.horizen.io
 * Default RPC URL: https://gobi-testnet.horizenlabs.io/ethv1
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { gobi } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: gobi,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const gobi = createCommon({
	..._gobi,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
