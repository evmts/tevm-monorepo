// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { taikoKatla as _taikoKatla } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the taikoKatla chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 167008
 * Chain Name: Taiko Katla (Alpha-6 Testnet)
 * Default Block Explorer: https://explorer.katla.taiko.xyz
 * Default RPC URL: https://rpc.katla.taiko.xyz
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { taikoKatla } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: taikoKatla,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const taikoKatla = createCommon({
	..._taikoKatla,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
