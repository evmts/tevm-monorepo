// Migrated to use nativeDefineChain instead of viem/chains

import { nativeDefineChain } from '@tevm/utils'
import { createCommon } from '../createCommon.js'

/**
 * Creates a common configuration for the bitTorrent chain.
 * @type {import('../Common.js').Common}
 * @description
 * Chain ID: 199
 * Chain Name: BitTorrent
 * Default Block Explorer: https://bttcscan.com
 * Default RPC URL: https://rpc.bittorrentchain.io
 * @example
 * import { createMemoryClient } from 'tevm'
 * import { bitTorrent } from 'tevm/common'
 * import { http } from 'tevm'
 *
 * const client = createMemoryClient({
 *   common: bitTorrent,
 *   fork: {
 *     transport: http({ url: 'https://example.com' })({})
 *   },
 * })
 */
export const bitTorrent = createCommon({
	...nativeDefineChain({
		id: 199,
		name: 'BitTorrent',
		nativeCurrency: { name: 'BitTorrent', symbol: 'BTT', decimals: 18 },
		rpcUrls: {
			default: {
				http: ['https://rpc.bittorrentchain.io'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Bttcscan',
				url: 'https://bttcscan.com',
				apiUrl: 'https://api.bttcscan.com/api',
			},
		},
		contracts: {
			multicall3: {
				address: '0xcA11bde05977b3631167028862bE2a173976CA11',
				blockCreated: 31078552,
			},
		},
	}),
	loggingLevel: 'warn',
	eips: [],
	hardfork: 'prague',
})
