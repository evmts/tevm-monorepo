// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { zetachain as _zetachain } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the zetachain chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 7000
 * Chain Name: ZetaChain
 * Default Block Explorer: https://explorer.zetachain.com
 * Default RPC URL: https://zetachain-evm.blockpi.network/v1/rpc/public
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { zetachain } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: zetachain,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const zetachain = createCommon({
	..._zetachain,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'homestead',
})
