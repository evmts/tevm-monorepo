// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { moonriver as _moonriver } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the moonriver chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 1285
 * Chain Name: Moonriver
 * Default Block Explorer: https://moonriver.moonscan.io
 * Default RPC URL: https://moonriver.public.blastapi.io
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { moonriver } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: moonriver,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const moonriver = createCommon({
	..._moonriver,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'homestead',
})
