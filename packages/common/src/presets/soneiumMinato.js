// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { soneiumMinato as _soneiumMinato } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the soneiumMinato chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 1946
 * Chain Name: Soneium Minato
 * Default Block Explorer: https://explorer-testnet.soneium.org
 * Default RPC URL: https://rpc.minato.soneium.org
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { soneiumMinato } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: soneiumMinato,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const soneiumMinato = createCommon({
	..._soneiumMinato,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})