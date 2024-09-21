// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { blastSepolia as _blastSepolia } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the blastSepolia chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 168587773
 * Chain Name: Blast Sepolia
 * Default Block Explorer: https://sepolia.blastscan.io
 * Default RPC URL: https://sepolia.blast.io
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { blastSepolia } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: blastSepolia,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const blastSepolia = createCommon({
	..._blastSepolia,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})
