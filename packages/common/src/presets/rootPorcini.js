// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { rootPorcini as _rootPorcini } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the rootPorcini chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 7672
 * Chain Name: The Root Network - Porcini
 * Default Block Explorer: https://porcini.rootscan.io
 * Default RPC URL: https://porcini.rootnet.app/archive
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { rootPorcini } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: rootPorcini,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const rootPorcini = createCommon({
	..._rootPorcini,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'homestead',
})
