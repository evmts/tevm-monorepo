// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { skaleHumanProtocol as _skaleHumanProtocol } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the skaleHumanProtocol chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 1273227453
 * Chain Name: SKALE | Human Protocol
 * Default Block Explorer: https://wan-red-ain.explorer.mainnet.skalenodes.com
 * Default RPC URL: https://mainnet.skalenodes.com/v1/wan-red-ain
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { skaleHumanProtocol } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: skaleHumanProtocol,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const skaleHumanProtocol = createCommon({
	..._skaleHumanProtocol,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})