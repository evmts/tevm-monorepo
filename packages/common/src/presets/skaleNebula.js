// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { skaleNebula as _skaleNebula } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the skaleNebula chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 1482601649
 * Chain Name: SKALE | Nebula Gaming Hub
 * Default Block Explorer: https://green-giddy-denebola.explorer.mainnet.skalenodes.com
 * Default RPC URL: https://mainnet.skalenodes.com/v1/green-giddy-denebola
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { skaleNebula } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: skaleNebula,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const skaleNebula = createCommon({
	..._skaleNebula,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'homestead',
})
