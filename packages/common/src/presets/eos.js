// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { eos as _eos } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the eos chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 17777
 * Chain Name: EOS EVM
 * Default Block Explorer: https://explorer.evm.eosnetwork.com
 * Default RPC URL: https://api.evm.eosnetwork.com
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { eos } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: eos,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const eos = createCommon({
	..._eos,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})