// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { confluxESpaceTestnet as _confluxESpaceTestnet } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the confluxESpaceTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 71
 * Chain Name: Conflux eSpace Testnet
 * Default Block Explorer: https://evmtestnet.confluxscan.io
 * Default RPC URL: https://evmtestnet.confluxrpc.com
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { confluxESpaceTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: confluxESpaceTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const confluxESpaceTestnet = createCommon({
	..._confluxESpaceTestnet,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
