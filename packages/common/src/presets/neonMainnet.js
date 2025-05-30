// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { neonMainnet as _neonMainnet } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the neonMainnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 245022934
 * Chain Name: Neon EVM MainNet
 * Default Block Explorer: https://neonscan.org
 * Default RPC URL: https://neon-proxy-mainnet.solana.p2p.org
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { neonMainnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: neonMainnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const neonMainnet = createCommon({
	..._neonMainnet,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
