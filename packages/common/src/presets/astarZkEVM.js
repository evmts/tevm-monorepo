// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { astarZkEVM as _astarZkEVM } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the astarZkEVM chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 3776
 * Chain Name: Astar zkEVM
 * Default Block Explorer: https://astar-zkevm.explorer.startale.com
 * Default RPC URL: https://rpc.startale.com/astar-zkevm
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { astarZkEVM } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: astarZkEVM,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const astarZkEVM = createCommon({
	..._astarZkEVM,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})