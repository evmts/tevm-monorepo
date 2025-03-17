// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { metisGoerli as _metisGoerli } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the metisGoerli chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 599
 * Chain Name: Metis Goerli
 * Default Block Explorer: https://goerli.explorer.metisdevops.link
 * Default RPC URL: https://goerli.gateway.metisdevops.link
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { metisGoerli } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: metisGoerli,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const metisGoerli = createCommon({
	..._metisGoerli,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'homestead',
})
