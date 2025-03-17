// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { inEVM as _inEVM } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the inEVM chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 2525
 * Chain Name: inEVM Mainnet
 * Default Block Explorer: https://inevm.calderaexplorer.xyz
 * Default RPC URL: https://mainnet.rpc.inevm.com/http
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { inEVM } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: inEVM,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const inEVM = createCommon({
	..._inEVM,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'homestead',
})
