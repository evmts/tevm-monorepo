// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { xrSepolia as _xrSepolia } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the xrSepolia chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 2730
 * Chain Name: XR Sepolia
 * Default Block Explorer: https://xr-sepolia-testnet.explorer.caldera.xyz
 * Default RPC URL: https://xr-sepolia-testnet.rpc.caldera.xyz/http
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { xrSepolia } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: xrSepolia,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const xrSepolia = createCommon({
	..._xrSepolia,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
