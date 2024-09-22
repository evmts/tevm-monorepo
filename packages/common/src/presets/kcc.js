// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { kcc as _kcc } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the kcc chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 321
 * Chain Name: KCC Mainnet
 * Default Block Explorer: https://explorer.kcc.io
 * Default RPC URL: https://kcc-rpc.com
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { kcc } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: kcc,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const kcc = createCommon({
	..._kcc,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})