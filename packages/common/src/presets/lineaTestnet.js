// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { lineaTestnet as _lineaTestnet } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the lineaTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 59140
 * Chain Name: Linea Goerli Testnet
 * Default Block Explorer: https://goerli.lineascan.build
 * Default RPC URL: https://rpc.goerli.linea.build
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { lineaTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: lineaTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const lineaTestnet = createCommon({
	..._lineaTestnet,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})
