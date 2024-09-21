// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { unreal as _unreal } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the unreal chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 18233
 * Chain Name: Unreal
 * Default Block Explorer: https://unreal.blockscout.com
 * Default RPC URL: https://rpc.unreal-orbit.gelato.digital
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { unreal } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: unreal,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const unreal = createCommon({
	..._unreal,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})
