// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { fluenceStage as _fluenceStage } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the fluenceStage chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 123420000220
 * Chain Name: Fluence Stage
 * Default Block Explorer: https://blockscout.stage.fluence.dev
 * Default RPC URL: https://rpc.stage.fluence.dev
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { fluenceStage } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: fluenceStage,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const fluenceStage = createCommon({
	..._fluenceStage,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})