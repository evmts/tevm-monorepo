// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { hashkeyTestnet as _hashkeyTestnet } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the hashkeyTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 133
 * Chain Name: HashKey Chain Testnet
 * Default Block Explorer: https://hashkeychain-testnet-explorer.alt.technology
 * Default RPC URL: https://hashkeychain-testnet.alt.technology
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { hashkeyTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: hashkeyTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const hashkeyTestnet = createCommon({
	..._hashkeyTestnet,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})