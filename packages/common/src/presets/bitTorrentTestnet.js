// This file was auto-generated by __GENERATE_CHAIN_PRESETS__.js. Do not edit manually.

import { bitTorrentTestnet as _bitTorrentTestnet } from 'viem/chains'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the bitTorrentTestnet chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 1028
 * Chain Name: BitTorrent Chain Testnet
 * Default Block Explorer: https://testnet.bttcscan.com
 * Default RPC URL: https://testrpc.bittorrentchain.io
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { bitTorrentTestnet } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: bitTorrentTestnet,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const bitTorrentTestnet = createCommon({
	..._bitTorrentTestnet,
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'cancun',
})