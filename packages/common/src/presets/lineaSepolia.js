// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { lineaSepolia as _lineaSepolia } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the lineaSepolia chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 59141
 * Chain Name: Linea Sepolia Testnet
 * Default Block Explorer: https://sepolia.lineascan.build
 * Default RPC URL: https://rpc.sepolia.linea.build
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { lineaSepolia } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: lineaSepolia,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const lineaSepolia = createCommon({
	..._lineaSepolia,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})