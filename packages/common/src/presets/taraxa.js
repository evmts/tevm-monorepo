// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { taraxa as _taraxa } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the taraxa chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 841
 * Chain Name: Taraxa Mainnet
 * Default Block Explorer: https://explorer.mainnet.taraxa.io
 * Default RPC URL: https://rpc.mainnet.taraxa.io
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { taraxa } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: taraxa,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const taraxa = createCommon({
	..._taraxa,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})
