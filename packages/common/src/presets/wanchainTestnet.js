// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { wanchainTestnet as _wanchainTestnet } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the wanchainTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 999
 * Chain Name: Wanchain Testnet
 * Default Block Explorer: https://wanscan.org
 * Default RPC URL: https://gwan-ssl.wandevs.org:46891
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { wanchainTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: wanchainTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const wanchainTestnet = createCommon({
	..._wanchainTestnet,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
