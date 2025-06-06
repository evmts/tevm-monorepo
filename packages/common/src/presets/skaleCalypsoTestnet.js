// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { skaleCalypsoTestnet as _skaleCalypsoTestnet } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the skaleCalypsoTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 974399131
 * Chain Name: SKALE Calypso Testnet
 * Default Block Explorer: https://giant-half-dual-testnet.explorer.testnet.skalenodes.com
 * Default RPC URL: https://testnet.skalenodes.com/v1/giant-half-dual-testnet
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { skaleCalypsoTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: skaleCalypsoTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const skaleCalypsoTestnet = createCommon({
	..._skaleCalypsoTestnet,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
